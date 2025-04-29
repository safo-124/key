import { redirect } from 'next/navigation'; // Function for server-side redirects
import prisma from '@/lib/prisma'; // Import Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session data
import { Role } from '@prisma/client'; // Import Role enum
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // UI component for messages
import { Terminal } from 'lucide-react'; // Icon for Alert component

// This page acts as a router for coordinators.
// It fetches their assigned center and redirects them to the specific center management page.
export default async function CoordinatorLandingPage() {
  // Get the current user's session details from the server-side helper
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  // Although the parent layout might perform a check, it's good practice to verify here too.
  // Ensure the user has the COORDINATOR role.
  if (session?.role !== Role.COORDINATOR) {
     // If the user is not a Coordinator (e.g., Registry admin landed here accidentally),
     // redirect them to a more appropriate dashboard.
     if (session?.role === Role.REGISTRY) {
        redirect('/registry'); // Redirect Registry admin to their section
     }
     // Redirect any other unexpected roles to the main dashboard.
     redirect('/dashboard');
  }

  // --- Find Assigned Center ---
  try {
    // Query the database to find a 'Center' record where the 'coordinatorId'
    // matches the currently logged-in user's ID.
    const center = await prisma.center.findUnique({
      where: {
        coordinatorId: session.userId, // Use the user's ID from the session
      },
      select: { id: true }, // We only need the 'id' of the center for redirection
    });

    // --- Handle Redirection or Error Message ---
    if (center?.id) {
      // If a center is found (meaning the coordinator is assigned),
      // redirect them to the dynamic route for that specific center.
      console.log(`CoordinatorLandingPage: Redirecting Coordinator ${session.userId} to center /coordinator/${center.id}`);
      redirect(`/coordinator/${center.id}`); // Perform the redirect
    } else {
      // If no center is found for this coordinator ID, they haven't been assigned.
      console.warn(`CoordinatorLandingPage: Coordinator ${session.userId} has no center assigned.`);
      // Display an informative message to the user.
      return (
        <div className="container mx-auto p-6"> {/* Basic container for layout */}
           <Alert variant="destructive"> {/* Use Shadcn Alert component for styling */}
                <Terminal className="h-4 w-4" /> {/* Icon */}
                <AlertTitle>Assignment Issue</AlertTitle>
                <AlertDescription>
                    You are registered as a Coordinator, but you have not been assigned to manage a center yet.
                    Please contact the Registry administrator for assignment.
                </AlertDescription>
            </Alert>
        </div>
      );
    }
  } catch (error) {
    // Handle any potential errors during the database query.
    console.error("CoordinatorLandingPage: Error fetching center assignment:", error);
    // Display a generic error message if the database operation fails.
     return (
        <div className="container mx-auto p-6">
           <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                   Could not retrieve your center assignment due to an error. Please try again later or contact support.
                </AlertDescription>
            </Alert>
        </div>
      );
  }
}
