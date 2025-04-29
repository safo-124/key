import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlusCircle, Users } from 'lucide-react'; // Icons
import prisma from '@/lib/prisma'; // Import Prisma Client
import { getCurrentUserSession } from '@/lib/auth'; // Auth helper
import { Role, User } from '@prisma/client'; // Prisma enums/types
import { Button } from '@/components/ui/button'; // Shadcn UI Button
import { UsersTable } from '@/components/tables/UsersTable'; // The table component

// Metadata for the page (SEO and browser tab title)
export const metadata: Metadata = {
  title: 'Manage Users',
  description: 'View, create, and manage all users in the system.',
};

// Define the structure of user data passed to the UsersTable component.
// This includes the basic User fields plus details about their assignments.
export type UserWithAssignment = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'> & {
  coordinatedCenter: { id: string; name: string } | null; // Center they coordinate (if role is COORDINATOR)
  lecturerCenter: { id: string; name: string } | null;    // Center they are assigned to (if role is LECTURER)
  department: { id: string; name: string } | null;        // Department they are assigned to (if role is LECTURER)
};

// The Users Management Page Component (Server Component)
export default async function RegistryUsersPage() {
  // Security check: Ensure the current user has the REGISTRY role. Redirect if not.
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("RegistryUsersPage: Non-registry user attempting access.");
    redirect('/dashboard'); // Redirect unauthorized users
  }

  // Fetch all users from the database.
  // Include related data needed for the 'Assignment' column in the table.
  const users: UserWithAssignment[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      // Include the center they coordinate (if applicable)
      coordinatedCenter: {
        select: { id: true, name: true },
      },
      // Include the center they are assigned to as a lecturer (if applicable)
      lecturerCenter: {
        select: { id: true, name: true },
      },
      // Include the department they are assigned to (if applicable)
      department: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: 'desc', // Display newest users first
    },
  });

  console.log(`RegistryUsersPage: Fetched ${users.length} users.`);

  return (
    <div className="space-y-6"> {/* Adds vertical spacing between elements */}
      {/* Page Header: Title and Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-3 h-7 w-7" /> {/* Icon */}
            Manage Users
        </h1>
        {/* Button to navigate to the user creation page */}
        <Button asChild>
          <Link href="/registry/users/create"> {/* Correct link to the create page */}
            <PlusCircle className="mr-2 h-4 w-4" /> Create New User
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        View and manage all registered users, including their roles and assignments.
      </p>

      {/* Render the UsersTable component, passing the fetched user data */}
      <UsersTable data={users} />

    </div>
  );
}
