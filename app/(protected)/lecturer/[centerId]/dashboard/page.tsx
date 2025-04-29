import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus } from '@prisma/client'; // Import ClaimStatus
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, XCircle, Clock, FilePlus } from 'lucide-react'; // Icons

// Define props type including URL parameters
type LecturerDashboardPageProps = {
  params: {
    centerId: string;
  };
};

// Generate dynamic metadata
export async function generateMetadata({ params }: LecturerDashboardPageProps): Promise<Metadata> {
  // Fetch minimal data for title, checking access implicitly
  const session = getCurrentUserSession();
  const center = await prisma.center.findFirst({
    where: { id: params.centerId, lecturers: { some: { id: session?.userId } } },
    select: { name: true },
  });

  return {
    title: center ? `Lecturer Dashboard: ${center.name}` : 'Lecturer Dashboard',
    description: `Dashboard for lecturer in center ${center?.name || params.centerId}.`,
  };
}

// The Lecturer's Center Dashboard Page component (Server Component)
export default async function LecturerCenterDashboardPage({ params }: LecturerDashboardPageProps) {
  const { centerId } = params;
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  // 1. Must be a Lecturer
  if (session?.role !== Role.LECTURER) {
    redirect('/dashboard'); // Redirect non-lecturers
  }
  // 2. Must be assigned to THIS centerId
  const userAssignment = await prisma.user.findFirst({
      where: {
          id: session.userId,
          lecturerCenterId: centerId, // Check assignment matches URL
      },
      select: { id: true, name: true, lecturerCenter: { select: { name: true } } } // Fetch center name too
  });

  if (!userAssignment) {
      console.warn(`LecturerCenterDashboardPage: Lecturer ${session.userId} failed access check for center ${centerId}.`);
      redirect('/dashboard'); // Redirect if not assigned to this center
  }

  const centerName = userAssignment.lecturerCenter?.name || 'Your Center';

  // --- Data Fetching for Summary ---
  let claimCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  try {
    const counts = await prisma.claim.groupBy({
        by: ['status'],
        where: {
            submittedById: session.userId, // Claims submitted by this lecturer
            centerId: centerId,         // Within this center
        },
        _count: {
            status: true,
        },
    });

    counts.forEach(item => {
        if (item.status === ClaimStatus.PENDING) claimCounts.pending = item._count.status;
        if (item.status === ClaimStatus.APPROVED) claimCounts.approved = item._count.status;
        if (item.status === ClaimStatus.REJECTED) claimCounts.rejected = item._count.status;
    });

    console.log(`LecturerCenterDashboardPage: Fetched claim counts for user ${session.userId} in center ${centerId} - `, claimCounts);
  } catch (error) {
      console.error("LecturerCenterDashboardPage: Failed to fetch claim counts:", error);
      // Continue rendering even if counts fail
  }

  const basePath = `/lecturer/${centerId}`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, {userAssignment.name || 'Lecturer'}! Manage your claims for <strong>{centerName}</strong>.
      </p>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
         <Card className="flex flex-col"> {/* Use flex-col to push button down */}
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FilePlus className="h-5 w-5 text-primary"/> Submit a New Claim</CardTitle>
                <CardDescription>Create and submit a new claim for review by your coordinator.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent> {/* Spacer */}
            <CardFooter>
                <Button asChild className="w-full sm:w-auto">
                    <Link href={`${basePath}/claims/create`}>Create Claim</Link>
                </Button>
            </CardFooter>
         </Card>
         <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> View My Claims</CardTitle>
                <CardDescription>Review the status and details of all claims you have submitted for this center.</CardDescription>
            </CardHeader>
             <CardContent className="flex-grow"></CardContent> {/* Spacer */}
            <CardFooter>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href={`${basePath}/claims`}>View Claims</Link>
                </Button>
            </CardFooter>
         </Card>
      </div>

      {/* Claim Status Summary */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">My Claim Summary</h2>
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{claimCounts.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting coordinator review</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{claimCounts.approved}</div>
                <p className="text-xs text-muted-foreground">Approved by coordinator</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Claims</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{claimCounts.rejected}</div>
                <p className="text-xs text-muted-foreground">Rejected by coordinator</p>
            </CardContent>
            </Card>
        </div>
      </div>

    </div>
  );
}
