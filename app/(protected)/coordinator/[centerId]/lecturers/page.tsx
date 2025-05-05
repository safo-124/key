import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, User, Department } from '@prisma/client';
import { AssignedLecturersTable } from '@/components/tables/AssignedLecturersTable';
import { CreateLecturerForm } from '@/components/forms/CreateLecturerForm';
import { Users, UserPlus } from 'lucide-react';

type CoordinatorLecturersPageProps = {
  params: {
    centerId: string;
  };
};

export async function generateMetadata({ params }: CoordinatorLecturersPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `Lecturers - ${center.name}` : 'Center Lecturers',
    description: `Manage lecturers assigned to ${center?.name || 'your center'}`,
  };
}

export type AssignedLecturer = Pick<User, 'id' | 'name' | 'email'> & {
    department?: { id: string; name: string } | null;
};

export default async function CoordinatorLecturersPage({ params }: CoordinatorLecturersPageProps) {
  const { centerId } = params;
  const session = await getCurrentUserSession();

  // Authorization
  if (session?.role !== Role.COORDINATOR) {
    console.warn(`CoordinatorLecturersPage: Non-coordinator user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard');
  }

  const center = await prisma.center.findUnique({
    where: {
      id: centerId,
      coordinatorId: session.userId,
    },
    select: { id: true, name: true }
  });

  if (!center) {
    console.warn(`CoordinatorLecturersPage: Coordinator ${session.userId} failed access check for center ${centerId}.`);
    redirect('/dashboard');
  }

  // Data Fetching
  const [assignedLecturers, departments] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: Role.LECTURER,
        lecturerCenterId: centerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: { select: { id: true, name: true } }
      },
      orderBy: { name: 'asc' },
    }),
    prisma.department.findMany({
      where: { centerId: centerId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
  ]);

  console.log(`CoordinatorLecturersPage: Displaying ${assignedLecturers.length} lecturers, ${departments.length} departments for center ${center.name}`);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Lecturer Management
        </h1>
        <p className="text-muted-foreground">
          Manage lecturers for <span className="font-medium text-primary">{center.name}</span>
        </p>
      </div>

      {/* Create Lecturer Card */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">
              Add New Lecturer
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Register a new lecturer to assign to this center
          </p>
        </div>
        <div className="p-6 pt-0">
          <CreateLecturerForm centerId={center.id} departments={departments} />
        </div>
      </div>

      {/* Lecturers List Card */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">
                Assigned Lecturers
              </h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
              {assignedLecturers.length} lecturer{assignedLecturers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Lecturers currently assigned to this center
          </p>
        </div>
        <div className="p-6 pt-0">
          <AssignedLecturersTable
            centerId={center.id}
            assignedLecturers={assignedLecturers}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
}