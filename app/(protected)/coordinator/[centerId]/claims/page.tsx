import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, Claim, User, ClaimStatus } from '@prisma/client'; // Prisma types and enums
import { ClaimsTable } from '@/components/tables/ClaimsTable'; // The table component to display claims
import { FileText } from 'lucide-react'; // Icon for the page title

// Define the structure for props passed to the page component, including URL parameters
type CoordinatorClaimsPageProps = {
  params: {
    centerId: string; // The dynamic center ID from the URL
  };
};

// Function to generate dynamic metadata for the page (e.g., browser tab title)
export async function generateMetadata({ params }: CoordinatorClaimsPageProps): Promise<Metadata> {
  // Fetch the center name to include in the title
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `Claims Review: ${center.name}` : 'Claims Review', // Dynamic title
    description: `Review and manage claims submitted for center ${center?.name || params.centerId}.`, // Dynamic description
  };
}

// Define the type for claim data passed to the ClaimsTable component.
// Includes the base Claim fields plus selected fields from the submitting User.
export type ClaimWithSubmitter = Claim & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'>; // Include submitter's ID, name, and email
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
  // Fetch the center ensuring it exists and the coordinatorId matches the logged-in user.
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
     // Redirect to a safe page, like their dashboard or an error page.
     redirect('/dashboard');
     // Alternatively, use notFound() if the center truly doesn't exist for this user.
     // notFound();
  }

  // --- Data Fetching ---
  // Fetch all claims associated with this specific center.
  const claims: ClaimWithSubmitter[] = await prisma.claim.findMany({
    where: {
        centerId: centerId // Filter claims by the centerId from the URL
    },
    include: {
      submittedBy: { // Include details of the user who submitted the claim
        select: { id: true, name: true, email: true } // Select only necessary submitter fields
      }
      // Optionally include processedBy details if needed directly on the list view
      // processedBy: { select: { id: true, name: true, email: true } }
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
      <ClaimsTable
        centerId={center.id} // Pass centerId for potential actions within the table
        claims={claims} // Pass the array of fetched claims
        currentUserId={session.userId} // Pass the coordinator's ID (needed for action authorization)
      />
    </div>
  );
}
