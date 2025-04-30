import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link'; // For navigation links
import { ArrowLeft, FilePlus } from 'lucide-react'; // Icons

import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role } from '@prisma/client'; // Prisma types
import { Button } from '@/components/ui/button'; // Shadcn UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateClaimForm } from '@/components/forms/CreateClaimForm'; // The complex form component

// Define the structure for props passed to the page component,
// including URL parameters like centerId.
type CreateClaimPageProps = {
    params: {
        centerId: string; // The dynamic center ID from the URL
    };
};

// Function to generate dynamic metadata for the page
export async function generateMetadata({ params }: CreateClaimPageProps): Promise<Metadata> {
  // Basic metadata, could fetch center name if desired
  return {
    title: 'Submit New Claim',
    description: `Submit a new claim for center ${params.centerId}.`,
  };
}

// The Create Claim Page Component (Server Component)
export default async function CreateClaimPage({ params }: CreateClaimPageProps) {
  const { centerId } = params; // Extract centerId from the URL parameters
  const session = getCurrentUserSession(); // Get the current user's session details

  // --- Authorization Check ---
  // 1. Verify the user has the LECTURER role.
  if (session?.role !== Role.LECTURER) {
    console.warn(`CreateClaimPage: Non-lecturer user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect unauthorized roles
  }

  // 2. Verify this lecturer is assigned to THIS specific center.
  // Fetch the user record ensuring the lecturerCenterId matches the centerId from the URL.
  const userAssignment = await prisma.user.findFirst({
      where: {
          id: session.userId, // Match the logged-in user
          lecturerCenterId: centerId, // Ensure assignment matches the URL parameter
      },
      select: { id: true } // Only need to confirm existence
  });

  // If no assignment is found matching the user and center, redirect.
  if (!userAssignment) {
      console.warn(`CreateClaimPage: Lecturer ${session.userId} failed access check for center ${centerId}. Redirecting.`);
      redirect('/dashboard'); // Or show a specific "not assigned" message/page
  }

  // --- Render Page ---
  return (
    <div className="space-y-6"> {/* Adds vertical spacing between elements */}

       {/* Back Button */}
       <Button variant="outline" size="sm" asChild>
        {/* Link back to the claims list page for this specific center */}
        <Link href={`/lecturer/${centerId}/claims`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Claims List
        </Link>
      </Button>

      {/* Main Card containing the form */}
      <Card className="max-w-3xl mx-auto"> {/* Increased max-width for the complex form */}
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
              <FilePlus className="mr-3 h-6 w-6 text-primary" /> {/* Icon */}
              Submit New Claim
            </CardTitle>
          <CardDescription>
            Select the type of claim and fill out the required details. Your claim will be sent to your center coordinator for review.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Render the complex claim form component */}
           {/* Note: The CreateClaimForm itself doesn't need centerId passed as a prop */}
           {/* because the server action (`createClaim`) gets it from the session/user record. */}
           <CreateClaimForm />
        </CardContent>
      </Card>
    </div>
  );
}
