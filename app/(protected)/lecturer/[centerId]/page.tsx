// app/(protected)/lecturer/[centerId]/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma'; // Import Prisma client
import { getCurrentUserSession } from '@/lib/auth'; // Import the auth helper
import { Role, ClaimStatus } from '@prisma/client'; // Import enums
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn Card
import { Button } from '@/components/ui/button'; // Shadcn Button
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Shadcn Alert
import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import { Terminal, LayoutDashboard, Building, Users, FileText, Settings, FilePlus, AlertCircle, CheckCircle, XCircle, Clock, ArrowRight, Hand, Building2, Target, BookUser, Hourglass, Check, Ban } from 'lucide-react'; // Added more specific icons

// Define props type including URL parameters
type LecturerCenterPageProps = {
    params: {
        centerId: string; // Center ID from the URL
    };
};

// Function to generate dynamic metadata for the page
export async function generateMetadata({ params }: LecturerCenterPageProps): Promise<Metadata> {
    const session = getCurrentUserSession();
    // Fetch center name for the title, basic auth check
    const center = await prisma.center.findFirst({
        where: {
            id: params.centerId,
            // Ensure the current user is a lecturer assigned to this center
            lecturers: { some: { id: session?.userId, role: Role.LECTURER } }
         },
        select: { name: true },
    });

    return {
        title: `Lecturer Dashboard - ${center?.name || 'Center'}`,
        description: `Your dashboard for managing claims within the ${center?.name || 'assigned'} center.`,
    };
}


// Helper function to format numbers (optional)
const formatCount = (count: number): string => count.toLocaleString();

// The main Lecturer Center Landing Page component (Server Component)
export default async function LecturerCenterPage({ params }: LecturerCenterPageProps) {
    const { centerId } = params;
    // Get the current user session on the server
    const session = getCurrentUserSession();

    // --- Authorization & Data Fetching ---
    // 1. If no session, redirect to login
    if (!session) {
        console.log("LecturerCenterPage: No session found, redirecting to login.");
        redirect('/login');
    }

    // 2. Must be a Lecturer
    if (session.role !== Role.LECTURER) {
        console.warn(`LecturerCenterPage: Non-lecturer user (Role: ${session.role}) attempting access.`);
        redirect('/dashboard'); // Redirect to general dashboard
    }

    let assignmentError: string | null = null;
    let centerName: string | null = null;
    let stats: { pending: number; approved: number; rejected: number } = { pending: 0, approved: 0, rejected: 0 };

    try {
        // 3. Verify Lecturer is assigned to THIS center and get center name
        const lecturerData = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { lecturerCenterId: true, lecturerCenter: { select: { name: true } } },
        });

        if (!lecturerData?.lecturerCenterId) {
            assignmentError = "You are not assigned to any Center. Please contact your Coordinator or the Registry.";
        } else if (lecturerData.lecturerCenterId !== centerId) {
            // If the user is assigned, but not to the center they are trying to access via URL
            console.warn(`LecturerCenterPage: Lecturer ${session.userId} attempting access to incorrect center ${centerId}. Assigned to ${lecturerData.lecturerCenterId}. Redirecting.`);
            // Redirect them to their actual assigned center's page
            redirect(`/lecturer/${lecturerData.lecturerCenterId}`);
        } else {
            // User is assigned to the correct center
            centerName = lecturerData.lecturerCenter?.name;

            // 4. Fetch claim statistics for this lecturer in this center
            const claimCounts = await prisma.claim.groupBy({
                by: ['status'],
                where: { submittedById: session.userId, centerId: centerId },
                _count: { status: true }
            });

            claimCounts.forEach(item => {
                if (item.status === ClaimStatus.PENDING) stats.pending = item._count.status;
                if (item.status === ClaimStatus.APPROVED) stats.approved = item._count.status;
                if (item.status === ClaimStatus.REJECTED) stats.rejected = item._count.status;
            });
        }
    } catch (error) {
        console.error("LecturerCenterPage: Error fetching data:", error);
        assignmentError = "Could not load dashboard details due to an error.";
        // Depending on the error, you might still want to show part of the page or redirect
    }

    // --- Render Page Content ---

    // Display assignment error if present
    if (assignmentError) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Assignment Issue</AlertTitle>
                    <AlertDescription>{assignmentError}</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Define links based on fetched centerId
    const lecturerClaimsLink = `/lecturer/${centerId}/claims`;
    const lecturerCreateLink = `/lecturer/${centerId}/claims/create`;
    const cardHoverStyle = "transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"; // Enhanced hover effect

    return (
        <div className="space-y-10"> {/* Increased overall spacing */}

            {/* Welcome Banner Section - Updated to Blue Gradient */}
            <div className="relative p-8 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl"> {/* Changed gradient */}
                 {/* Optional: subtle background pattern or element */}
                 <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
                            <BookUser className="h-9 w-9 opacity-90" /> {/* Slightly larger icon */}
                            Lecturer Dashboard
                        </h1>
                        <p className="text-lg text-blue-100/90"> {/* Adjusted text color for blue bg */}
                            Welcome, <span className="font-semibold">{session.name || 'Lecturer'}</span>! Manage your claims for the <strong className="font-semibold">{centerName || 'assigned'}</strong> center.
                        </p>
                    </div>
                    {/* Adjusted badge colors for blue background */}
                    <Badge variant="secondary" className="capitalize text-lg bg-white/90 text-blue-900 px-4 py-1.5 rounded-full shadow-md font-medium">
                        {session.role.toLowerCase()}
                    </Badge>
                </div>
            </div>

            {/* Statistics Section - Enhanced Cards */}
            <section className="space-y-5">
                 {/* Changed accent border to match new banner color */}
                <h2 className="text-2xl font-semibold text-gray-800 border-l-4 border-blue-700 pl-3">Your Claim Summary</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Pending Claims Card */}
                    <Link href={`${lecturerClaimsLink}?status=PENDING`} className="block group">
                        <Card className={`${cardHoverStyle} border-l-4 border-yellow-500`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium text-yellow-700">Pending Claims</CardTitle>
                                <Hourglass className="h-5 w-5 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-800">{formatCount(stats.pending)}</div>
                                <p className="text-sm text-muted-foreground mt-1">Awaiting coordinator review</p>
                            </CardContent>
                        </Card>
                    </Link>
                    {/* Approved Claims Card */}
                    <Link href={`${lecturerClaimsLink}?status=APPROVED`} className="block group">
                        <Card className={`${cardHoverStyle} border-l-4 border-green-600`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium text-green-700">Approved Claims</CardTitle>
                                <Check className="h-5 w-5 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-800">{formatCount(stats.approved)}</div>
                                <p className="text-sm text-muted-foreground mt-1">Approved for processing</p>
                            </CardContent>
                        </Card>
                    </Link>
                    {/* Rejected Claims Card */}
                    <Link href={`${lecturerClaimsLink}?status=REJECTED`} className="block group">
                        <Card className={`${cardHoverStyle} border-l-4 border-red-600`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium text-red-700">Rejected Claims</CardTitle>
                                <Ban className="h-5 w-5 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-800">{formatCount(stats.rejected)}</div>
                                <p className="text-sm text-muted-foreground mt-1">Rejected by coordinator</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </section>

            {/* Actions Section - Clearer Call to Action */}
            <section className="space-y-5">
                 {/* Changed accent border to match new banner color */}
                 <h2 className="text-2xl font-semibold text-gray-800 border-l-4 border-blue-700 pl-3">Quick Actions</h2>
                 <Card className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border border-gray-200">
                     <CardHeader>
                        <CardTitle className="text-xl text-gray-800">Ready to Submit?</CardTitle>
                        <CardDescription>Start a new claim submission or review your past claims.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center gap-4 pt-2 pb-4">
                         {/* Updated button colors to match blue theme */}
                        <Button asChild size="lg" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-transform duration-200 hover:scale-105 focus-visible:ring-blue-500">
                            <Link href={lecturerCreateLink}>
                                <FilePlus className="mr-2 h-5 w-5"/> Submit New Claim
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-blue-700 text-blue-800 hover:bg-blue-50 hover:text-blue-900 focus-visible:ring-blue-500">
                            <Link href={lecturerClaimsLink}>
                                <FileText className="mr-2 h-5 w-5"/> View My Claims History
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>

        </div>
    );
}
