import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus } from '@prisma/client'; // Import ClaimStatus
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Building2, Users, AlertCircle } from 'lucide-react'; // Icons

// Define props type including URL parameters
type CoordinatorCenterPageProps = {
  params: {
    centerId: string;
  };
};

// Generate dynamic metadata (optional but good practice)
export async function generateMetadata({ params }: CoordinatorCenterPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `Overview: ${center.name}` : 'Center Overview',
    description: `Dashboard for managing center ${center?.name || params.centerId}.`,
  };
}

// The Center Overview Page component (Server Component)
export default async function CoordinatorCenterPage({ params }: CoordinatorCenterPageProps) {
  const { centerId } = params;
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  // 1. Must be Coordinator role
  // 2. Must be assigned to THIS centerId
  if (session?.role !== Role.COORDINATOR) {
    redirect('/dashboard'); // Redirect if not coordinator
  }

  const center = await prisma.center.findUnique({
    where: {
      id: centerId,
      coordinatorId: session.userId, // Crucial check: ensure this user coordinates THIS center
    },
    select: {
      id: true,
      name: true,
      // Fetch counts for the dashboard cards
      _count: {
        select: {
          departments: true,
          lecturers: true,
          claims: { where: { status: ClaimStatus.PENDING } } // Count only PENDING claims
        }
      }
    }
  });

  // If center not found OR coordinator doesn't match, redirect/show error
  if (!center) {
     console.warn(`CoordinatorCenterPage: Coordinator ${session.userId} failed access check for center ${centerId}.`);
     // Redirect to their main dashboard or show an "unauthorized" message
     // Or potentially check if they are Registry and allow view-only? Depends on requirements.
     redirect('/dashboard');
     // Or use notFound(); if it's truly just not found for this user
     // notFound();
  }

  console.log(`CoordinatorCenterPage: Displaying overview for center ${center.name} (${center.id})`);

  // Data for cards
  const pendingClaimsCount = center._count.claims;
  const departmentCount = center._count.departments;
  const lecturerCount = center._count.lecturers;
  const basePath = `/coordinator/${centerId}`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Center Overview</h2>
      <p className="text-muted-foreground">
        Summary statistics and quick actions for managing <strong>{center.name}</strong>.
      </p>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <AlertCircle className={`h-4 w-4 ${pendingClaimsCount > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaimsCount}</div>
            <p className="text-xs text-muted-foreground">Claims awaiting your review</p>
             <Button size="sm" variant="outline" className="mt-3" asChild>
                <Link href={`${basePath}/claims`}>Review Claims</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentCount}</div>
            <p className="text-xs text-muted-foreground">Departments within this center</p>
             <Button size="sm" variant="outline" className="mt-3" asChild>
                <Link href={`${basePath}/departments`}>Manage Departments</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Lecturers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lecturerCount}</div>
            <p className="text-xs text-muted-foreground">Lecturers in this center</p>
             <Button size="sm" variant="outline" className="mt-3" asChild>
                <Link href={`${basePath}/lecturers`}>View Lecturers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Maybe add recent activity or other relevant info here */}

    </div>
  );
}
