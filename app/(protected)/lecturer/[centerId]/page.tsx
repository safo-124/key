// app/(protected)/lecturer/[centerId]/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BookUser, Hourglass, Check, Ban, FilePlus, FileText, AlertCircle } from 'lucide-react';

type LecturerCenterPageProps = {
    params: {
        centerId: string;
    };
};

export async function generateMetadata({ params }: LecturerCenterPageProps): Promise<Metadata> {
    const session = await getCurrentUserSession();
    const center = await prisma.center.findFirst({
        where: {
            id: params.centerId,
            lecturers: { some: { id: session?.userId, role: Role.LECTURER } }
        },
        select: { name: true },
    });

    return {
        title: `${center?.name || 'Center'} Dashboard`,
        description: `Lecturer dashboard for ${center?.name || 'your assigned'} center`,
    };
}

const formatCount = (count: number): string => count.toLocaleString();

export default async function LecturerCenterPage({ params }: LecturerCenterPageProps) {
    const { centerId } = params;
    const session = await getCurrentUserSession();

    if (!session) redirect('/login');
    if (session.role !== Role.LECTURER) redirect('/dashboard');

    let assignmentError: string | null = null;
    let centerName: string | null = null;
    let stats = { pending: 0, approved: 0, rejected: 0 };

    try {
        const lecturerData = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { 
                lecturerCenterId: true, 
                lecturerCenter: { select: { name: true } } 
            },
        });

        if (!lecturerData?.lecturerCenterId) {
            assignmentError = "You are not assigned to any Center. Please contact your Coordinator.";
        } else if (lecturerData.lecturerCenterId !== centerId) {
            redirect(`/lecturer/${lecturerData.lecturerCenterId}`);
        } else {
            centerName = lecturerData.lecturerCenter?.name;

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
        console.error("LecturerCenterPage error:", error);
        assignmentError = "Could not load dashboard data. Please try again later.";
    }

    if (assignmentError) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Assignment Issue</AlertTitle>
                    <AlertDescription>{assignmentError}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const claimsLink = `/lecturer/${centerId}/claims`;
    const createLink = `/lecturer/${centerId}/claims/create`;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-blue-900 flex items-center gap-3">
                            <BookUser className="h-8 w-8 text-blue-700" />
                            Dashboard
                        </h1>
                        <p className="text-blue-800 mt-2">
                            Welcome back, <span className="font-semibold text-blue-900">{session.name}</span>.
                            Here's your claim activity summary for <span className="font-medium">{centerName}</span>.
                        </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Lecturer
                    </Badge>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard 
                    title="Pending Claims"
                    value={stats.pending}
                    icon={<Hourglass className="h-5 w-5 text-blue-600" />}
                    href={`${claimsLink}?status=PENDING`}
                    color="border-blue-200 bg-blue-50"
                />
                <StatCard 
                    title="Approved Claims"
                    value={stats.approved}
                    icon={<Check className="h-5 w-5 text-blue-600" />}
                    href={`${claimsLink}?status=APPROVED`}
                    color="border-blue-200 bg-blue-50"
                />
                <StatCard 
                    title="Rejected Claims"
                    value={stats.rejected}
                    icon={<Ban className="h-5 w-5 text-blue-600" />}
                    href={`${claimsLink}?status=REJECTED`}
                    color="border-blue-200 bg-blue-50"
                />
            </div>

            {/* Actions Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <ActionCard 
                    title="Submit New Claim"
                    description="Start a new claim submission"
                    icon={<FilePlus className="h-5 w-5 text-blue-600" />}
                    href={createLink}
                    buttonText="Create Claim"
                    variant="default"
                    color="bg-blue-50 border-blue-100"
                />
                <ActionCard 
                    title="View All Claims"
                    description="Review your claim history"
                    icon={<FileText className="h-5 w-5 text-blue-600" />}
                    href={claimsLink}
                    buttonText="View Claims"
                    variant="outline"
                    color="bg-blue-50 border-blue-100"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, href, color }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    href: string;
    color: string;
}) {
    return (
        <Link href={href}>
            <Card className={`border-l-4 ${color} hover:shadow-md transition-all hover:border-blue-300`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-blue-800">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-900">{formatCount(value)}</div>
                </CardContent>
            </Card>
        </Link>
    );
}

function ActionCard({ title, description, icon, href, buttonText, variant, color }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    buttonText: string;
    variant: "default" | "outline";
    color: string;
}) {
    return (
        <Card className={`${color} border`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                        {icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg text-blue-900">{title}</CardTitle>
                        <CardDescription className="text-blue-700">{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Button 
                    asChild 
                    variant={variant} 
                    className={`w-full ${
                        variant === 'default' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                >
                    <Link href={href}>
                        {buttonText}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}