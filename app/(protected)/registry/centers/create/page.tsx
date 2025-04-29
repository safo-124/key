import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getCurrentUserSession } from '@/lib/auth';
import { CreateCenterForm } from '@/components/forms/CreateCenterForm'; // We'll create this next
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Metadata for the page
export const metadata: Metadata = {
  title: 'Create New Center',
  description: 'Add a new center and assign a coordinator.',
};

// Type for the coordinator data passed to the form's select input
export type AvailableCoordinator = {
  id: string;
  name: string | null;
  email: string;
};

// The Create Center Page component (Server Component)
export default async function CreateCenterPage() {
  // Role check for security
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("CreateCenterPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  let availableCoordinators: AvailableCoordinator[] = [];
  let fetchError: string | null = null;

  try {
    // Fetch users who have the COORDINATOR role
    const potentialCoordinators = await prisma.user.findMany({
      where: {
        role: Role.COORDINATOR,
      },
      select: {
        id: true,
        name: true,
        email: true,
        coordinatedCenter: true, // Check if they are already linked to a center
      },
    });

    // Filter out coordinators who are already assigned to a center
    availableCoordinators = potentialCoordinators
      .filter(user => !user.coordinatedCenter) // Keep only users where coordinatedCenter is null
      .map(({ id, name, email }) => ({ id, name, email })); // Map to the desired format

    console.log(`CreateCenterPage: Found ${availableCoordinators.length} available coordinators.`);

  } catch (error) {
    console.error("CreateCenterPage: Failed to fetch available coordinators:", error);
    fetchError = "Could not load the list of available coordinators. Please try again later.";
  }

  return (
    <div className="space-y-6">
       <Card className="max-w-2xl mx-auto"> {/* Center the card */}
        <CardHeader>
          <CardTitle>Create New Center</CardTitle>
          <CardDescription>
            Enter the name for the new center and select an available coordinator to manage it.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Pass the fetched coordinators and any fetch error to the form */}
           <CreateCenterForm
              availableCoordinators={availableCoordinators}
              fetchError={fetchError}
            />
        </CardContent>
      </Card>
    </div>
  );
}
