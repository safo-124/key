import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link'; // For navigation links
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, ClaimStatus } from '@prisma/client'; // Import necessary Prisma enums
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn UI Card components
import { Button } from '@/components/ui/button'; // Shadcn UI Button component
import { FileText, CheckCircle, XCircle, Clock, FilePlus, LayoutDashboard } from 'lucide-react'; // Icons for visual representation

// Define the structure for props passed to the page component,
// including URL parameters like centerId.
type LecturerDashboardPageProps = {
  params: {
    centerId: string; // The dynamic center ID from the URL
  };
};

// Function to generate dynamic metadata for the page (e.g., browser tab title)
export async function generateMetadata({ params }: LecturerDashboardPageProps): Promise<Metadata> {
  // Fetch minimal data for title, performing an implicit access check
  const session = getCurrentUserSession(); // Assume session is available server-side
  // Verify user is assigned to this center before fetching center name
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
    title: center ? `Lecturer Dashboard: ${center.name}` : 'Lecturer Dashboard',
    // Set a dynamic description
    description: `Dashboard for lecturer activities in center ${center?.name || params.centerId}.`,
  };
}

// The main Server Component for the Lecturer's Center Dashboard Page
export default async function LecturerCenterDashboardPage({ params }: LecturerDashboardPageProps) {
  const { centerId } = params; // Extract centerId from the URL parameters
  const session = getCurrentUserSession(); // Get the current user's session details

  // --- Authorization Check ---
  // 1. Verify the user has the LECTURER role.
  if (session?.role !== Role.LECTURER) {
    console.warn(`LecturerCenterDashboardPage: Non-lecturer user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect non-lecturers
  }

  // 2. Verify this lecturer is assigned to THIS specific center.
  // Fetch the user record ensuring the lecturerCenterId matches the centerId from the URL.
  const userAssignment = await prisma.user.findFirst({
      where: {
          id: session.userId, // Match the logged-in user
          lecturerCenterId: centerId, // Ensure assignment matches the URL parameter
      },
      // Select necessary fields for display and confirmation
      select: { id: true, name: true, lecturerCenter: { select: { name: true } } }
  });

  // If no assignment is found matching the user and center, redirect.
  if (!userAssignment) {
      console.warn(`LecturerCenterDashboardPage: Lecturer ${session.userId} failed access check for center ${centerId}. Redirecting.`);
      redirect('/dashboard'); // Or show a specific "not assigned" message/page
  }

  // Get the center name from the fetched assignment details.
  const centerName = userAssignment.lecturerCenter?.name || 'Your Assigned Center';

  // --- Data Fetching for Summary Cards ---
  // Initialize claim counts
  let claimCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  try {
    // Use Prisma's groupBy to efficiently count claims by status for this user and center.
    const counts = await prisma.claim.groupBy({
        by: ['status'], // Group the results by the 'status' field
        where: {
            submittedById: session.userId, // Filter claims submitted by the current lecturer
            centerId: centerId,         // Filter claims belonging to this specific center
        },
        _count: { // Specify the aggregation: count occurrences of 'status'
            status: true,
        },
    });

    // Map the grouped counts to our claimCounts object
    counts.forEach(item => {
        if (item.status === ClaimStatus.PENDING) claimCounts.pending = item._count.status;
        if (item.status === ClaimStatus.APPROVED) claimCounts.approved = item._count.status;
        if (item.status === ClaimStatus.REJECTED) claimCounts.rejected = item._count.status;
    });

    console.log(`LecturerCenterDashboardPage: Fetched claim counts for user ${session.userId} in center ${centerId} - `, claimCounts);
  } catch (error) {
      // Log error if fetching counts fails, but allow the page to render without stats.
      console.error("LecturerCenterDashboardPage: Failed to fetch claim counts:", error);
      // You could set an error state here to display a message to the user if desired.
  }

  // Define the base path for links within this center's context for easier reuse.
  const basePath = `/lecturer/${centerId}`;

  // --- Render Page ---
  return (
    <div className="space-y-6"> {/* Adds vertical spacing between child elements */}
      {/* Page Title and Welcome Message */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-primary"/> {/* Dashboard Icon */}
          Lecturer Dashboard
      </h1>
      <p className="text-muted-foreground">
        Welcome, {userAssignment.name || 'Lecturer'}! Here's an overview of your activities for <strong>{centerName}</strong>.
      </p>

      {/* Quick Actions Section - using a responsive grid */}
      <div className="grid gap-4 sm:grid-cols-2">
         {/* Card for Submitting a New Claim */}
         <Card className="flex flex-col"> {/* Use flex-col to allow footer button alignment */}
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FilePlus className="h-5 w-5 text-primary"/> Submit a New Claim</CardTitle>
                <CardDescription>Create and submit a new claim (Teaching, Transportation, Thesis/Project) for review.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent> {/* Empty content acts as a spacer */}
            <CardFooter>
                {/* Button linking to the claim creation page */}
                <Button asChild className="w-full sm:w-auto">
                    <Link href={`${basePath}/claims/create`}>Create Claim</Link>
                </Button>
            </CardFooter>
         </Card>
         {/* Card for Viewing Submitted Claims */}
         <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> View My Claims</CardTitle>
                <CardDescription>Review the status and details of all claims you have submitted for this center.</CardDescription>
            </CardHeader>
             <CardContent className="flex-grow"></CardContent> {/* Spacer */}
            <CardFooter>
                {/* Button linking to the claims list page */}
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href={`${basePath}/claims`}>View My Claims</Link>
                </Button>
            </CardFooter>
         </Card>
      </div>

      {/* Claim Status Summary Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">My Claim Summary</h2>
        {/* Responsive grid for status cards */}
        <div className="grid gap-4 md:grid-cols-3">
            {/* Pending Claims Card */}
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" /> {/* Icon */}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{claimCounts.pending}</div>
                <p className="text-xs text-muted-foreground">Claims awaiting review</p>
            </CardContent>
            </Card>
            {/* Approved Claims Card */}
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" /> {/* Icon */}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{claimCounts.approved}</div>
                <p className="text-xs text-muted-foreground">Claims approved by coordinator</p>
            </CardContent>
            </Card>
            {/* Rejected Claims Card */}
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" /> {/* Icon */}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{claimCounts.rejected}</div>
                <p className="text-xs text-muted-foreground">Claims rejected by coordinator</p>
            </CardContent>
            </Card>
        </div>
      </div>

    </div>
  );
}
