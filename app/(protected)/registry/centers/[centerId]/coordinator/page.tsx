import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeCoordinatorForm } from '@/components/forms/ChangeCoordinatorForms'; // We'll create this

// Define props type including URL parameters
type ChangeCoordinatorPageProps = {
  params: {
    centerId: string;
  };
};

// Generate dynamic metadata
export async function generateMetadata({ params }: ChangeCoordinatorPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `Change Coordinator: ${center.name}` : 'Change Coordinator',
    description: `Change the coordinator for center ${center?.name || params.centerId}.`,
  };
}

// Type for coordinator data passed to the form
export type CoordinatorInfo = Pick<User, 'id' | 'name' | 'email'> | null;
export type AvailableCoordinator = Pick<User, 'id' | 'name' | 'email'>;

// The Change Coordinator Page component (Server Component)
export default async function ChangeCoordinatorPage({ params }: ChangeCoordinatorPageProps) {
  const { centerId } = params;

  // Role check
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    redirect('/dashboard');
  }

  // Fetch center details including the current coordinator
  const center = await prisma.center.findUnique({
    where: { id: centerId },
    select: {
        id: true,
        name: true,
        coordinator: { // Include current coordinator details
            select: { id: true, name: true, email: true }
        }
     },
  });

  if (!center) {
    notFound();
  }

  // Fetch users who are available to be assigned as coordinator
  // (Have COORDINATOR role AND are NOT currently assigned to ANY center)
  // Include the current coordinator in this list as well, in case they need to be re-selected (though unlikely)
  const availableCoordinators: AvailableCoordinator[] = await prisma.user.findMany({
    where: {
      role: Role.COORDINATOR,
      // Fetch users who either have no center assigned OR are assigned to THIS center
      // This allows seeing the current coordinator in the list if needed, but the action should prevent re-assigning the same one.
      // A simpler approach is to only fetch those with coordinatedCenter: null, but this way shows the current one too.
      OR: [
        { coordinatedCenter: null }, // Not assigned to any center
        // { id: center.coordinator?.id } // Include the current coordinator (Optional)
      ]
    },
     select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Filter out the current coordinator from the "available" list for the dropdown,
  // as we only want to show *other* potential coordinators.
  const trulyAvailableCoordinators = availableCoordinators.filter(
      coord => coord.id !== center.coordinator?.id
  );


  console.log(`ChangeCoordinatorPage: Center ${center.name}, Current Coordinator: ${center.coordinator?.email}, Available: ${trulyAvailableCoordinators.length}`);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/registry/centers/${centerId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Center Details
        </Link>
      </Button>

      {/* Main Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><UserCog className="mr-2 h-5 w-5" /> Change Coordinator</CardTitle>
          <CardDescription>Assign a new coordinator for the center: <strong>{center.name}</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-md bg-muted/50">
            <h3 className="font-semibold mb-2">Current Coordinator:</h3>
            {center.coordinator ? (
                 <p>{center.coordinator.name || 'N/A'} ({center.coordinator.email})</p>
            ) : (
                <p className="text-destructive">No coordinator currently assigned.</p>
            )}
          </div>

          <ChangeCoordinatorForm
            centerId={center.id}
            currentCoordinatorId={center.coordinator?.id || null}
            availableCoordinators={trulyAvailableCoordinators} // Pass only genuinely available ones
          />
        </CardContent>
      </Card>
    </div>
  );
}
