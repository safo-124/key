import { redirect } from 'next/navigation'; // Function for server-side redirects
import prisma from '@/lib/prisma'; // Import Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session data
import { Role } from '@prisma/client'; // Import Role enum
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // UI component for messages
import { Terminal } from 'lucide-react'; // Icon for Alert component

// This page acts as a router for lecturers.
// It fetches their assigned center and redirects them to their claims page within that center.
export default async function LecturerLandingPage() {
  // Get the current user's session details from the server-side helper
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  // Ensure the user has the LECTURER role.
  if (session?.role !== Role.LECTURER) {
     // If the user is not a Lecturer (e.g., Registry/Coordinator landed here accidentally),
     // redirect them to a more appropriate dashboard.
     if (session?.role === Role.REGISTRY) {
        redirect('/registry');
     }
     if (session?.role === Role.COORDINATOR) {
         // Redirect coordinator to their landing page which handles center redirection
         redirect('/coordinator');
     }
     // Redirect any other unexpected roles to the main dashboard.
     redirect('/dashboard');
  }

  // --- Find Assigned Center ---
  try {
    // Fetch the lecturer's user record to get their assigned center ID.
    const lecturer = await prisma.user.findUnique({
      where: {
        id: session.userId, // Use the user's ID from the session
      },
      select: { lecturerCenterId: true }, // Only need the 'lecturerCenterId' field
    });

    // --- Handle Redirection or Error Message ---
    if (lecturer?.lecturerCenterId) {
      // If a center ID is found, redirect them to their claims page for that center.
      const centerId = lecturer.lecturerCenterId;
      console.log(`LecturerLandingPage: Redirecting Lecturer ${session.userId} to center ${centerId} claims page.`);
      redirect(`/lecturer/${centerId}/claims`); // Perform the redirect
    } else {
      // If no center is assigned (lecturerCenterId is null).
      console.warn(`LecturerLandingPage: Lecturer ${session.userId} has no center assigned.`);
      // Display an informative message to the user.
      return (
        <div className="container mx-auto p-6"> {/* Basic container for layout */}
           <Alert variant="destructive"> {/* Use Shadcn Alert component for styling */}
                <Terminal className="h-4 w-4" /> {/* Icon */}
                <AlertTitle>Assignment Required</AlertTitle>
                <AlertDescription>
                    You are registered as a Lecturer, but you have not yet been assigned to a center.
                    Please contact your Center Coordinator or the Registry administrator for assignment before you can submit claims.
                </AlertDescription>
            </Alert>
        </div>
      );
    }
  } catch (error) {
    // Handle any potential errors during the database query.
    console.error("LecturerLandingPage: Error fetching user assignment:", error);
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
