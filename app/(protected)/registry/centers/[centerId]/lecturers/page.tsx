import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedLecturersTable } from '@/components/tables/AssignedLecturersTable'; // To display current lecturers
import { AddLecturerForm } from '@/components/forms/AddLecturerForm'; // To add new lecturers

// Define props type including URL parameters
type ManageLecturersPageProps = {
  params: {
    centerId: string;
  };
};

// Generate dynamic metadata
export async function generateMetadata({ params }: ManageLecturersPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `Manage Lecturers: ${center.name}` : 'Manage Lecturers',
    description: `Assign and remove lecturers for center ${center?.name || params.centerId}.`,
  };
}

// Define types for data passed to client components
export type AssignedLecturer = Pick<User, 'id' | 'name' | 'email'>;
export type AvailableLecturer = Pick<User, 'id' | 'name' | 'email'>;

// The Manage Lecturers Page component (Server Component)
export default async function ManageLecturersPage({ params }: ManageLecturersPageProps) {
  const { centerId } = params;

  // Role check
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    redirect('/dashboard');
  }

  // Fetch center details (to confirm existence and get name)
  const center = await prisma.center.findUnique({
    where: { id: centerId },
    select: { id: true, name: true },
  });

  if (!center) {
    notFound();
  }

  // Fetch lecturers currently assigned to this center
  const assignedLecturers: AssignedLecturer[] = await prisma.user.findMany({
    where: {
      role: Role.LECTURER,
      lecturerCenterId: centerId, // Filter by this center's ID
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

  // Fetch lecturers who are available to be assigned
  // (Have LECTURER role AND are NOT assigned to ANY center)
  // Note: Depending on requirements, you might want to allow assigning lecturers already in *other* centers.
  // This implementation assumes a lecturer belongs to only one center at a time.
  const availableLecturers: AvailableLecturer[] = await prisma.user.findMany({
    where: {
      role: Role.LECTURER,
      lecturerCenterId: null, // Only those not currently assigned to any center
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

  console.log(`ManageLecturersPage: Center ${center.name}, Assigned: ${assignedLecturers.length}, Available: ${availableLecturers.length}`);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/registry/centers/${centerId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Center Details
        </Link>
      </Button>

      <h1 className="text-3xl font-bold">Manage Lecturers for {center.name}</h1>

      {/* Card for Adding Lecturers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><UserPlus className="mr-2 h-5 w-5" /> Assign Lecturer</CardTitle>
          <CardDescription>Select an available lecturer to assign them to this center.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddLecturerForm
            centerId={center.id}
            availableLecturers={availableLecturers}
          />
        </CardContent>
      </Card>

      {/* Card for Viewing/Removing Assigned Lecturers */}
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Currently Assigned Lecturers ({assignedLecturers.length})</CardTitle>
           <CardDescription>View lecturers currently assigned to this center. You can remove them from here.</CardDescription>
        </CardHeader>
        <CardContent>
           <AssignedLecturersTable
              centerId={center.id}
              assignedLecturers={assignedLecturers}
            />
        </CardContent>
      </Card>
    </div>
  );
}
