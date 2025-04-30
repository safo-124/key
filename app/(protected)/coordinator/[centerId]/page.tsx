import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link'; // For navigation links
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, ClaimStatus } from '@prisma/client'; // Import necessary Prisma enums
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn UI Card components
import { Button } from '@/components/ui/button'; // Shadcn UI Button component
import { FileText, Building2, Users, AlertCircle } from 'lucide-react'; // Icons for visual representation

// Define the structure for props passed to the page component,
// including URL parameters like centerId.
type CoordinatorCenterPageProps = {
  params: {
    centerId: string; // The dynamic center ID from the URL
  };
};

// Function to generate dynamic metadata for the page (e.g., browser tab title)
// This is good practice for SEO and user experience.
export async function generateMetadata({ params }: CoordinatorCenterPageProps): Promise<Metadata> {
  // Fetch the center name to include in the title.
  // Basic access check happens implicitly here if the center doesn't exist.
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true }, // Only select the name for the metadata
  });
  return {
    // Set the title dynamically based on the fetched center name
    title: center ? `Overview: ${center.name}` : 'Center Overview',
    // Set a dynamic description
    description: `Dashboard for managing center ${center?.name || params.centerId}.`,
  };
}

// The main Server Component for the Coordinator's Center Overview Page
export default async function CoordinatorCenterPage({ params }: CoordinatorCenterPageProps) {
  const { centerId } = params; // Extract centerId from the URL parameters
  const session = getCurrentUserSession(); // Get the current user's session details

  // --- Authorization Check ---
  // 1. Verify the user has the COORDINATOR role.
  if (session?.role !== Role.COORDINATOR) {
    console.warn(`CoordinatorCenterPage: Non-coordinator user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect unauthorized roles to the main dashboard
  }

  // 2. Verify this coordinator is assigned to THIS specific center.
  // Fetch the center ensuring it exists AND the coordinatorId matches the logged-in user's ID.
  const center = await prisma.center.findUnique({
    where: {
      id: centerId,
      coordinatorId: session.userId, // Crucial check for ownership/assignment
    },
    select: { // Select all necessary fields for this page
      id: true,
      name: true,
      // Use _count to efficiently get aggregate counts of related records
      _count: {
        select: {
          departments: true, // Count all departments linked to this center
          lecturers: true,   // Count all lecturers linked to this center
          claims: { where: { status: ClaimStatus.PENDING } } // Count only claims with PENDING status for this center
        }
      }
    }
  });

  // If the center is not found OR the coordinator doesn't match, deny access.
  if (!center) {
     console.warn(`CoordinatorCenterPage: Coordinator ${session.userId} failed access check for center ${centerId}.`);
     // Redirect to a safe page, like their main dashboard, as they shouldn't be here.
     redirect('/dashboard');
     // Alternatively, use notFound() to show a 404 error if preferred.
     // notFound();
  }

  console.log(`CoordinatorCenterPage: Displaying overview for center ${center.name} (${center.id})`);

  // Extract counts from the fetched data for easier use in the JSX
  const pendingClaimsCount = center._count.claims;
  const departmentCount = center._count.departments;
  const lecturerCount = center._count.lecturers;
  // Define the base path for links within this center's context
  const basePath = `/coordinator/${centerId}`;

  // --- Render Page ---
  return (
    <div className="space-y-6"> {/* Adds vertical spacing between child elements */}
      {/* Page Title and Description */}
      <h1 className="text-3xl font-bold">Center Overview</h1>
      <p className="text-muted-foreground">
        Summary statistics and quick actions for managing <strong>{center.name}</strong>.
      </p>

      {/* Stats Cards Section - using a responsive grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pending Claims Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            {/* Use an alert icon, potentially colored if count > 0 */}
            <AlertCircle className={`h-4 w-4 ${pendingClaimsCount > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaimsCount}</div>
            <p className="text-xs text-muted-foreground">Claims awaiting your review</p>
             {/* Button linking directly to the claims review page for this center */}
             <Button size="sm" variant="outline" className="mt-3 text-xs h-7" asChild>
                <Link href={`${basePath}/claims`}>Review Claims</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Departments Card */}
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" /> {/* Department icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentCount}</div>
            <p className="text-xs text-muted-foreground">Departments within this center</p>
             {/* Button linking directly to the department management page */}
             <Button size="sm" variant="outline" className="mt-3 text-xs h-7" asChild>
                <Link href={`${basePath}/departments`}>Manage Departments</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Lecturers Card */}
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Lecturers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" /> {/* Users icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lecturerCount}</div>
            <p className="text-xs text-muted-foreground">Lecturers in this center</p>
             {/* Button linking directly to the lecturer management/view page */}
             <Button size="sm" variant="outline" className="mt-3 text-xs h-7" asChild>
                <Link href={`${basePath}/lecturers`}>Manage Lecturers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for other potential dashboard sections */}
      {/* You could add components here for recent activity, charts, etc. */}
      {/*
      <div>
        <h2 className="text-2xl font-semibold mb-3">Recent Activity</h2>
        <Card>
            <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">No recent activity to display.</p>
            </CardContent>
        </Card>
      </div>
      */}

    </div>
  );
}
