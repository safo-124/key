import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, Claim, User, ClaimStatus, ClaimType, ThesisType } from '@prisma/client'; // Import necessary Prisma types/enums
import { ClaimsTable } from '@/components/tables/ClaimsTable'; // The table component to display claims
import { FileText } from 'lucide-react'; // Icon for the page title

// Define the structure for props passed to the page component,
// including URL parameters like centerId.
type CoordinatorClaimsPageProps = {
  params: {
    centerId: string; // The dynamic center ID from the URL
  };
};

// Function to generate dynamic metadata for the page (e.g., browser tab title)
export async function generateMetadata({ params }: CoordinatorClaimsPageProps): Promise<Metadata> {
  // Fetch the center name to include in the title.
  // Basic access check happens implicitly here if the center doesn't exist.
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true }, // Only select the name
  });
  return {
    // Set the title dynamically based on the fetched center name
    title: center ? `Claims Review: ${center.name}` : 'Claims Review',
    // Set a dynamic description
    description: `Review and manage claims submitted for center ${center?.name || params.centerId}.`,
  };
}

// Define the type for claim data passed to the ClaimsTable component.
// Includes selected fields from the base Claim model and the submitting User.
// Also includes fields needed for the 'Details' and 'Amount' column derivation in the table.
// ** REMOVED generic 'title' and 'amount' **
export type ClaimForCoordinatorView = Pick<Claim,
    'id' |
    'claimType' |
    'status' |
    'submittedAt' |
    'processedAt' |
    'transportAmount' // Keep specific transport amount (might be null)
> & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'>; // Include submitter's ID, name, and email
    // Add specific fields useful for identifying the claim in the list view
    teachingDate?: Date | null;
    transportDestinationTo?: string | null;
    transportDestinationFrom?: string | null;
    thesisType?: ThesisType | null;
    thesisExamCourseCode?: string | null;
};

// The main Server Component for the Coordinator's Claims Management Page
export default async function CoordinatorClaimsPage({ params }: CoordinatorClaimsPageProps) {
  const { centerId } = params; // Extract centerId from the URL parameters
  const session = getCurrentUserSession(); // Get the current user's session details

  // --- Authorization Check ---
  // 1. Verify the user has the COORDINATOR role.
  if (session?.role !== Role.COORDINATOR) {
    console.warn(`CoordinatorClaimsPage: Non-coordinator user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect unauthorized roles
  }

  // 2. Verify this coordinator is assigned to THIS specific center.
  // Fetch the center ensuring it exists AND the coordinatorId matches the logged-in user's ID.
  const center = await prisma.center.findUnique({
    where: {
      id: centerId,
      coordinatorId: session.userId, // Crucial check for ownership/assignment
    },
    select: { id: true, name: true } // Select needed fields (ID for actions, name for display)
  });

  // If the center is not found OR the coordinator doesn't match, deny access.
  if (!center) {
     console.warn(`CoordinatorClaimsPage: Coordinator ${session.userId} failed access check for center ${centerId}.`);
     // Redirect to a safe page, like their main dashboard.
     redirect('/dashboard');
  }

  // --- Data Fetching ---
  // Fetch all claims associated with this specific center.
  const claims: ClaimForCoordinatorView[] = await prisma.claim.findMany({
    where: {
        centerId: centerId // Filter claims by the centerId from the URL
    },
    select: { // Select only the fields needed for the table display and actions
        id: true,
        claimType: true,
        status: true,
        submittedAt: true,
        processedAt: true,
        // amount: false, // Explicitly exclude generic amount
        // title: false, // Explicitly exclude generic title
        transportAmount: true, // Keep specific transport amount
        // Include submitter details
        submittedBy: {
            select: { id: true, name: true, email: true }
        },
        // Include fields useful for list display derivation
        teachingDate: true,
        transportDestinationTo: true,
        transportDestinationFrom: true,
        thesisType: true,
        thesisExamCourseCode: true,
    },
    orderBy: [
        // Custom sorting: PENDING first, then others by submission date descending
        { status: 'asc' }, // PENDING < APPROVED < REJECTED alphabetically
        { submittedAt: 'desc' } // Newest claims first within each status group
    ]
  });

  console.log(`CoordinatorClaimsPage: Displaying ${claims.length} claims for center ${center.name}`);

  // --- Render Page ---
  return (
    <div className="space-y-6"> {/* Adds vertical spacing between elements */}
      {/* Page Title */}
      <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-3 h-7 w-7 text-primary" /> {/* Icon and Title */}
          Claims for Review
      </h1>
      {/* Page Description */}
      <p className="text-muted-foreground">
        Review claims submitted by lecturers in <strong>{center.name}</strong>. Approve or reject pending claims using the action buttons in the table.
      </p>

      {/* Render the ClaimsTable component, passing the fetched claims data and necessary IDs */}
      {/* Ensure ClaimsTable component is updated to handle the new 'ClaimForCoordinatorView' type structure */}
      <ClaimsTable
        centerId={center.id} // Pass centerId for potential actions within the table
        claims={claims} // Pass the array of fetched claims
        currentUserId={session.userId} // Pass the coordinator's ID (needed for action authorization)
      />
    </div>
  );
}
