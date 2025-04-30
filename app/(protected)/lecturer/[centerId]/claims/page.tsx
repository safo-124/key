import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link'; // For navigation links
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, Claim, ClaimStatus, ClaimType } from '@prisma/client'; // Import necessary Prisma types/enums
import { Button } from '@/components/ui/button'; // Shadcn UI Button component
import { LecturerClaimsTable } from '@/components/tables/LecturerClaimsTable'; // The table component to display claims
import { FileText, FilePlus } from 'lucide-react'; // Icons for visual representation

// Define the structure for props passed to the page component,
// including URL parameters like centerId.
type LecturerClaimsPageProps = {
  params: {
    centerId: string; // The dynamic center ID from the URL
  };
};

// Function to generate dynamic metadata for the page (e.g., browser tab title)
export async function generateMetadata({ params }: LecturerClaimsPageProps): Promise<Metadata> {
  const session = getCurrentUserSession(); // Get session to check assignment
  // Fetch center name for title, ensuring user belongs to it for basic access check
  const center = await prisma.center.findFirst({
    where: {
        id: params.centerId,
        // Check if the lecturers relation includes the current user
        lecturers: { some: { id: session?.userId } }
    },
    select: { name: true }, // Only select the name
  });
  return {
    // Set the title dynamically based on the fetched center name
    title: center ? `My Claims: ${center.name}` : 'My Claims',
    // Set a dynamic description
    description: `View your submitted claims for center ${center?.name || params.centerId}.`,
  };
}

// Define the type for claim data passed to the LecturerClaimsTable component.
// Selects fields relevant for the list view.
export type LecturerClaim = Pick<Claim,
    "id" | "claimType" | "submittedAt" | "processedAt" | "status" 
> & {
    // Include specific fields needed for the 'details' column derivation
    transportDestinationTo?: string | null;
    transportDestinationFrom?: string | null;
    thesisType?: Claim['thesisType']; // Use Prisma's generated type
    thesisExamCourseCode?: string | null;
};


// The main Server Component for the Lecturer's Claims List Page
export default async function LecturerClaimsPage({ params }: LecturerClaimsPageProps) {
  const { centerId } = params; // Extract centerId from the URL parameters
  const session = getCurrentUserSession(); // Get the current user's session details

  // --- Authorization Check ---
  // 1. Verify the user has the LECTURER role.
  if (session?.role !== Role.LECTURER) {
    console.warn(`LecturerClaimsPage: Non-lecturer user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect unauthorized roles
  }

  // 2. Verify this lecturer is assigned to THIS specific center.
  // Fetch the user record ensuring the lecturerCenterId matches the centerId from the URL.
  const userAssignment = await prisma.user.findFirst({
      where: {
          id: session.userId, // Match the logged-in user
          lecturerCenterId: centerId, // Ensure assignment matches the URL parameter
      },
      // Select necessary fields for display and confirmation
      select: { id: true, lecturerCenter: { select: { name: true } } }
  });

  // If no assignment is found matching the user and center, redirect.
  if (!userAssignment) {
      console.warn(`LecturerClaimsPage: Lecturer ${session.userId} failed access check for center ${centerId}. Redirecting.`);
      redirect('/dashboard'); // Or show a specific "not assigned" message/page
  }

  // Get the center name from the fetched assignment details for display.
  const centerName = userAssignment.lecturerCenter?.name || 'this center';

  // --- Data Fetching ---
  // Fetch claims submitted by this specific lecturer for this specific center.
  const claims: LecturerClaim[] = await prisma.claim.findMany({
    where: {
        submittedById: session.userId, // Filter by the logged-in lecturer's ID
        centerId: centerId,         // Filter by the centerId from the URL
    },
    select: { // Select only the fields needed for the table display and detail derivation
        id: true,
        claimType: true,
         // Keep amount as it might be used as fallback
        status: true,
        submittedAt: true,
        processedAt: true,
        // Include specific fields needed for the 'details' column in the table
        transportDestinationTo: true,
        transportDestinationFrom: true,
        thesisType: true,
        thesisExamCourseCode: true,
        // Exclude fields not shown in the list view for efficiency
        
        teachingDate: false,
        teachingStartTime: false,
        teachingEndTime: false,
        teachingHours: false,
        transportType: false, // Not shown directly in list
        transportRegNumber: false,
        transportCubicCapacity: false,
        transportAmount: false, // Use generic 'amount' if needed, or fetch specific if required by table
        thesisSupervisionRank: false,
        thesisExamDate: false,
        processedById: false,
        centerId: false,
        submittedById: false,
    },
    orderBy: {
      submittedAt: 'desc', // Show the most recently submitted claims first
    },
  });

  console.log(`LecturerClaimsPage: Displaying ${claims.length} claims for user ${session.userId} in center ${centerName}`);

  // --- Render Page ---
  return (
    <div className="space-y-6"> {/* Adds vertical spacing between elements */}

      {/* Page Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side: Title and Description */}
        <div>
            <h1 className="text-3xl font-bold flex items-center">
                <FileText className="mr-3 h-7 w-7 text-primary" /> {/* Icon */}
                My Claims
            </h1>
            <p className="text-muted-foreground mt-1">
                Status of claims you have submitted for <strong>{centerName}</strong>.
            </p>
        </div>
        {/* Right side: Action Button */}
        <Button asChild size="sm">
          {/* Link to the claim creation page for this center */}
          <Link href={`/lecturer/${centerId}/claims/create`}>
            <FilePlus className="mr-2 h-4 w-4" /> Submit New Claim
          </Link>
        </Button>
      </div>


      {/* Render the table component, passing the fetched claims data */}
      {/* This table component will display the list of claims */}
      <LecturerClaimsTable claims={claims} />

    </div>
  );
}
