import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getCurrentUserSession } from '@/lib/auth';
import { CreateCenterForm } from '@/components/forms/CreateCenterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create New Center',
  description: 'Add a new center and assign a coordinator.',
};

export type AvailableCoordinator = {
  id: string;
  name: string | null;
  email: string;
};

export default async function CreateCenterPage() {
  const session = await getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("CreateCenterPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  let availableCoordinators: AvailableCoordinator[] = [];
  let fetchError: string | null = null;

  try {
    const potentialCoordinators = await prisma.user.findMany({
      where: {
        role: Role.COORDINATOR,
      },
      select: {
        id: true,
        name: true,
        email: true,
        coordinatedCenter: true,
      },
    });

    availableCoordinators = potentialCoordinators
      .filter(user => !user.coordinatedCenter)
      .map(({ id, name, email }) => ({ id, name, email }));

    console.log(`CreateCenterPage: Found ${availableCoordinators.length} available coordinators.`);

  } catch (error) {
    console.error("CreateCenterPage: Failed to fetch available coordinators:", error);
    fetchError = "Could not load the list of available coordinators. Please try again later.";
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6" />
            <div>
              <CardTitle className="text-white">Create New Center</CardTitle>
              <CardDescription className="text-blue-100">
                Enter center details and assign a coordinator
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {fetchError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <p className="text-sm text-red-700">{fetchError}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Center Information</h3>
              <p className="text-sm text-gray-500">
                Provide the name for the new center and select an available coordinator
              </p>
            </div>

            <CreateCenterForm
              availableCoordinators={availableCoordinators}
              fetchError={fetchError}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}