import { Metadata } from 'next'; // For setting page metadata
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, User, Department } from '@prisma/client'; // Prisma types
import { AssignedLecturersTable } from '@/components/tables/AssignedLecturersTable'; // Table to display lecturers
import { CreateLecturerForm } from '@/components/forms/CreateLecturerForm'; // Form to create new lecturers
import { Users, UserPlus } from 'lucide-react'; // Icons

// Define the structure for props passed to the page component, including URL parameters
type CoordinatorLecturersPageProps = {
  params: {
    centerId: string; // The dynamic center ID from the URL
  };
};

// Function to generate dynamic metadata for the page (e.g., browser tab title)
export async function generateMetadata({ params }: CoordinatorLecturersPageProps): Promise<Metadata> {
  // Fetch the center name to include in the title
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `Lecturers: ${center.name}` : 'Center Lecturers', // Dynamic title
    description: `View and create lecturers assigned to center ${center?.name || params.centerId}.`, // Dynamic description
  };
}

// Define the type for lecturer data passed to the AssignedLecturersTable component
// Includes optional department details for display.
export type AssignedLecturer = Pick<User, 'id' | 'name' | 'email'> & {
    department?: { id: string; name: string } | null; // Include optional department info
};

// The main Server Component for the Coordinator's Lecturer Management Page
export default async function CoordinatorLecturersPage({ params }: CoordinatorLecturersPageProps) {
  const { centerId } = params; // Extract centerId from the URL parameters
  const session = getCurrentUserSession(); // Get the current user's session details

  // --- Authorization Check ---
  // 1. Verify the user has the COORDINATOR role.
  if (session?.role !== Role.COORDINATOR) {
    console.warn(`CoordinatorLecturersPage: Non-coordinator user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect unauthorized roles
  }

  // 2. Verify this coordinator is assigned to THIS specific center.
  // Fetch the center ensuring it exists and the coordinatorId matches the logged-in user.
  const center = await prisma.center.findUnique({
    where: {
      id: centerId,
      coordinatorId: session.userId, // Crucial check for ownership/assignment
    },
    select: { id: true, name: true } // Select needed fields (ID for forms, name for display)
  });

  // If the center is not found OR the coordinator doesn't match, deny access.
  if (!center) {
     console.warn(`CoordinatorLecturersPage: Coordinator ${session.userId} failed access check for center ${centerId}.`);
     // Redirect to a safe page, like their dashboard or an error page.
     redirect('/dashboard');
  }

  // --- Data Fetching ---
  // Fetch the list of lecturers currently assigned to this specific center.
  // Include their assigned department details.
  const assignedLecturers: AssignedLecturer[] = await prisma.user.findMany({
    where: {
      role: Role.LECTURER, // Ensure only users with the Lecturer role are fetched
      lecturerCenterId: centerId, // Filter by this center's ID
    },
    select: { // Select only the necessary fields for the table and form
        id: true,
        name: true,
        email: true,
        department: { select: { id: true, name: true } } // Include assigned department name
    },
    orderBy: {
      name: 'asc', // Sort the list alphabetically by name for consistency
    },
  });

  // Fetch the list of departments belonging to this center
  // Needed to populate the dropdown in the CreateLecturerForm.
  const departments: Pick<Department, 'id' | 'name'>[] = await prisma.department.findMany({
      where: { centerId: centerId }, // Filter by this center's ID
      select: { id: true, name: true }, // Select only ID and name for the dropdown
      orderBy: { name: 'asc' }, // Sort alphabetically
  });

  console.log(`CoordinatorLecturersPage: Displaying ${assignedLecturers.length} lecturers, ${departments.length} departments for center ${center.name}`);

  // --- Render Page ---
  return (
    // Use space-y utility for vertical spacing between sections
    <div className="space-y-8">

      {/* Section to Create New Lecturer */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <UserPlus className="mr-3 h-6 w-6 text-primary" /> {/* Icon and Title */}
            Create New Lecturer
        </h2>
         {/* Render the form, passing the centerId and the list of departments */}
         <CreateLecturerForm centerId={center.id} departments={departments} />
      </div>


      {/* Section to View Assigned Lecturers */}
      <div>
        {/* Title displaying the count of assigned lecturers */}
        <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
             <Users className="mr-3 h-6 w-6 text-primary" /> {/* Icon and Title */}
             Assigned Lecturers ({assignedLecturers.length})
        </h2>
        <p className="text-muted-foreground mb-4">
            The following lecturers are currently assigned to <strong>{center.name}</strong>.
            You can assign them to specific departments using the 'Departments' section.
        </p>
        {/* Render the table component */}
        <AssignedLecturersTable
            centerId={center.id} // Pass centerId (needed internally by table actions if they were shown)
            assignedLecturers={assignedLecturers} // Pass the fetched lecturer data
            showActions={false} // Explicitly hide actions (like remove) for the Coordinator view
        />
      </div>

    </div>
  );
}
