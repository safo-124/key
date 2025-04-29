import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { EditCenterForm } from '@/components/forms/EditCenterForm'; // We'll create this
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Users } from 'lucide-react'; // Icons

// Define props type for the page component, including URL parameters
type ViewEditCenterPageProps = {
  params: {
    centerId: string; // The center ID from the URL
  };
};

// Function to generate metadata dynamically based on the center
export async function generateMetadata({ params }: ViewEditCenterPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });

  return {
    title: center ? `Center: ${center.name}` : 'Center Details',
    description: `View and manage details for center ${center?.name || params.centerId}.`,
  };
}

// The View/Edit Center Page component (Server Component)
export default async function ViewEditCenterPage({ params }: ViewEditCenterPageProps) {
  const { centerId } = params;

  // Role check
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("ViewEditCenterPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  // Fetch the specific center details, including coordinator and lecturers count
  const center = await prisma.center.findUnique({
    where: { id: centerId },
    include: {
      coordinator: { // Include coordinator details
        select: { id: true, name: true, email: true },
      },
      _count: { // Count the number of lecturers associated with this center
        select: { lecturers: true },
      },
    },
  });

  // If center not found, show a 404 page
  if (!center) {
    console.log(`ViewEditCenterPage: Center with ID ${centerId} not found.`);
    notFound();
  }

  console.log(`ViewEditCenterPage: Displaying details for center ${center.name} (${center.id})`);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href="/registry/centers">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Centers List
        </Link>
      </Button>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Center Details: {center.name}</CardTitle>
          <CardDescription>
            Manage the details, coordinator, and lecturers for this center.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 1: Edit Center Name */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Center Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pass current name and ID to the edit form */}
              <EditCenterForm centerId={center.id} currentName={center.name} />
            </CardContent>
          </Card>

          {/* Section 2: Coordinator Info & Management Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coordinator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {center.coordinator ? (
                <div>
                  <p><strong>Name:</strong> {center.coordinator.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {center.coordinator.email}</p>
                </div>
              ) : (
                <Badge variant="destructive">No Coordinator Assigned</Badge>
              )}
              {/* TODO: Link to coordinator management page */}
              <Button variant="outline" size="sm" disabled>
                 <User className="mr-2 h-4 w-4" /> Change Coordinator (TBD)
              </Button>
            </CardContent>
          </Card>

          {/* Section 3: Lecturers Info & Management Link */}
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lecturers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <p>
                 This center currently has{' '}
                 <strong>{center._count.lecturers}</strong>{' '}
                 lecturer(s) assigned.
               </p>
               {/* TODO: Link to lecturer management page */}
               <Button variant="outline" size="sm" disabled>
                  <Users className="mr-2 h-4 w-4" /> Manage Lecturers (TBD)
               </Button>
            </CardContent>
          </Card>

          {/* Section 4: Delete Center (Placeholder) */}
          <Card className="border-destructive">
             <CardHeader>
                <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Deleting a center is permanent and will remove associated departments, claims, and lecturer assignments (or handle based on schema rules). This action cannot be undone.
                </p>
                {/* TODO: Implement Delete functionality */}
                <Button variant="destructive" disabled>Delete Center (TBD)</Button>
             </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
