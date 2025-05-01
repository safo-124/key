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
  // Ensure the user has the COORDINATOR role.
  if (session?.role !== Role.COORDINATOR) {
     if (session?.role === Role.REGISTRY) {
        console.log("CoordinatorLandingPage: Registry user accessed, redirecting to /registry.");
        redirect('/registry');
     }
     console.log(`CoordinatorLandingPage: Non-coordinator user (Role: ${session?.role}) accessed, redirecting to /dashboard.`);
     redirect('/dashboard');
  }

  // --- Find Assigned Center ---
  let centerId: string | null = null;
  let fetchError: boolean = false;

  try {
    // Query the database to find a 'Center' record where the 'coordinatorId'
    // matches the currently logged-in user's ID.
    const center = await prisma.center.findUnique({
      where: {
        coordinatorId: session.userId, // Use the user's ID from the session
      },
      select: { id: true }, // We only need the 'id' of the center for redirection
    });

    if (center) {
        centerId = center.id;
    }
  } catch (error) {
    // Handle any potential errors during the database query.
    console.error("CoordinatorLandingPage: Error fetching center assignment:", error);
    fetchError = true; // Flag that an error occurred during fetch
  }

  // --- Handle Redirection or Error Message ---
  // Perform checks *after* the try...catch block

  if (fetchError) {
    // Display a generic error message if the database operation failed.
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

  if (centerId) {
    // If a center ID was successfully found, redirect them to the dynamic route for that specific center.
    console.log(`CoordinatorLandingPage: Redirecting Coordinator ${session.userId} to center /coordinator/${centerId}`);
    redirect(`/coordinator/${centerId}`); // Perform the redirect
  } else {
    // If no center is assigned (centerId is still null and no fetch error occurred).
    console.warn(`CoordinatorLandingPage: Coordinator ${session.userId} has no center assigned.`);
    // Display an informative message to the user.
    return (
      <div className="container mx-auto p-6"> {/* Basic container for layout */}
         <Alert variant="destructive"> {/* Use Shadcn Alert component for styling */}
              <Terminal className="h-4 w-4" /> {/* Icon */}
              <AlertTitle>Assignment Required</AlertTitle>
              <AlertDescription>
                  You are registered as a Coordinator, but you have not been assigned to manage a center yet.
                  Please contact the Registry administrator for assignment.
              </AlertDescription>
          </Alert>
      </div>
    );
  }

  // This part should ideally not be reached due to redirects or returns above.
  // return null;
}
