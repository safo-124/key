import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, Claim, ClaimStatus } from '@prisma/client'; // Import ClaimStatus
import { Button } from '@/components/ui/button';
import { LecturerClaimsTable } from '@/components/tables/LecturerClaimsTable'; // We'll create this next
import { FileText, FilePlus } from 'lucide-react'; // Icons

// Define props type including URL parameters
type LecturerClaimsPageProps = {
  params: {
    centerId: string;
  };
};

// Generate dynamic metadata
export async function generateMetadata({ params }: LecturerClaimsPageProps): Promise<Metadata> {
  const session = getCurrentUserSession();
  // Fetch center name for title, ensuring user belongs to it
  const center = await prisma.center.findFirst({
    where: { id: params.centerId, lecturers: { some: { id: session?.userId } } },
    select: { name: true },
  });
  return {
    title: center ? `My Claims: ${center.name}` : 'My Claims',
    description: `View your submitted claims for center ${center?.name || params.centerId}.`,
  };
}

// Type for claim data passed to the table
// We don't need submitter details here as it's always the current user
export type LecturerClaim = Omit<Claim, 'submittedById' | 'centerId' | 'processedById'> & {
    // We might want processor name later if needed
    // processedBy?: { name: string | null } | null
};


// The Lecturer's Claims List Page component (Server Component)
export default async function LecturerClaimsPage({ params }: LecturerClaimsPageProps) {
  const { centerId } = params;
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  // 1. Must be a Lecturer
  if (session?.role !== Role.LECTURER) {
    redirect('/dashboard');
  }
  // 2. Must be assigned to THIS centerId
  const userAssignment = await prisma.user.findFirst({
      where: { id: session.userId, lecturerCenterId: centerId },
      select: { id: true, lecturerCenter: { select: { name: true } } } // Fetch center name
  });
  if (!userAssignment) {
      console.warn(`LecturerClaimsPage: Lecturer ${session.userId} failed access check for center ${centerId}.`);
      redirect('/dashboard');
  }

  const centerName = userAssignment.lecturerCenter?.name || 'this center';

  // --- Data Fetching ---
  // Fetch claims submitted by this lecturer for this center
  const claims: LecturerClaim[] = await prisma.claim.findMany({
    where: {
        submittedById: session.userId, // Filter by the logged-in lecturer
        centerId: centerId,         // Filter by the center from the URL
    },
    select: { // Select only the fields needed for the table
        id: true,
        title: true,
        amount: true,
        status: true,
        submittedAt: true,
        processedAt: true,
        description: false, // Exclude description from list view for brevity
        // Optionally include processor details if needed later
        // processedBy: { select: { name: true } }
    },
    orderBy: {
      submittedAt: 'desc', // Show the most recently submitted claims first
    },
  });

  console.log(`LecturerClaimsPage: Displaying ${claims.length} claims for user ${session.userId} in center ${centerName}`);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold flex items-center">
                <FileText className="mr-3 h-7 w-7 text-primary" /> My Claims
            </h1>
            <p className="text-muted-foreground mt-1">
                Status of claims submitted for <strong>{centerName}</strong>.
            </p>
        </div>
        {/* Button to Create New Claim */}
        <Button asChild size="sm">
          <Link href={`/lecturer/${centerId}/claims/create`}>
            <FilePlus className="mr-2 h-4 w-4" /> Submit New Claim
          </Link>
        </Button>
      </div>


      {/* Render the table component, passing the fetched claims data */}
      <LecturerClaimsTable claims={claims} />

    </div>
  );
}
