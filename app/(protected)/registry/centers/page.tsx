import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import prisma from '@/lib/prisma'; // Import Prisma Client
import { Button } from '@/components/ui/button';
import { CentersTable } from '@/components/tables/CentersTable'; // We'll create this next
import { Metadata } from 'next';
import { getCurrentUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

// Set metadata for the page
export const metadata: Metadata = {
  title: 'Manage Centers',
  description: 'View and manage centers.',
};

// Define the type for the data we fetch and pass to the table
// Includes coordinator details for display
export type CenterWithCoordinator = {
  id: string;
  name: string;
  createdAt: Date;
  coordinator: {
    id: string;
    name: string | null;
    email: string;
  } | null; // Coordinator can potentially be null if relation is optional or broken, though our schema enforces it
};

// The page component (Server Component)
export default async function RegistryCentersPage() {
  // Optional: Add role check for extra security, although middleware should handle it
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("RegistryCentersPage: Non-registry user attempting access.");
    redirect('/dashboard'); // Redirect non-registry users
  }

  // Fetch all centers and include their coordinator's name and email
  const centers: CenterWithCoordinator[] = await prisma.center.findMany({
    include: {
      coordinator: { // Include the related User record for the coordinator
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Show newest centers first
    },
  });

  console.log(`RegistryCentersPage: Fetched ${centers.length} centers.`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Centers</h1>
        <Button asChild>
          <Link href="/registry/centers/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Center
          </Link>
        </Button>
      </div>

      {/* Render the table component, passing the fetched centers data */}
      <CentersTable data={centers} />

    </div>
  );
}
