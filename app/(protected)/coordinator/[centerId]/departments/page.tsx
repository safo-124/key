import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, Department } from '@prisma/client';
import { CreateDepartmentForm } from '@/components/forms/CreateDepartmentForm'; // We'll create this
import { DepartmentsTable } from '@/components/tables/DepartmentsTable'; // We'll create this
import { Building2 } from 'lucide-react';

// Define props type including URL parameters
type CoordinatorDepartmentsPageProps = {
  params: {
    centerId: string;
  };
};

// Generate dynamic metadata
export async function generateMetadata({ params }: CoordinatorDepartmentsPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({ where: { id: params.centerId }, select: { name: true } });
  return {
    title: center ? `Departments: ${center.name}` : 'Center Departments',
    description: `Manage departments for center ${center?.name || params.centerId}.`,
  };
}

// Type for department data passed to table (include lecturer count)
export type DepartmentWithLecturerCount = Department & {
    _count: { lecturers: number };
};

// The Coordinator's Department Management Page component (Server Component)
export default async function CoordinatorDepartmentsPage({ params }: CoordinatorDepartmentsPageProps) {
  const { centerId } = params;
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  if (session?.role !== Role.COORDINATOR) redirect('/dashboard');
  const center = await prisma.center.findUnique({ where: { id: centerId, coordinatorId: session.userId }, select: { id: true, name: true } });
  if (!center) redirect('/dashboard');

  // Fetch departments for this center, including a count of assigned lecturers
  const departments: DepartmentWithLecturerCount[] = await prisma.department.findMany({
    where: { centerId: centerId },
    include: {
        _count: { select: { lecturers: true } } // Count lecturers in each department
    },
    orderBy: { name: 'asc' },
  });

  console.log(`CoordinatorDepartmentsPage: Displaying ${departments.length} departments for center ${center.name}`);

  return (
    <div className="space-y-6">
      {/* Section to Create New Department */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Building2 className="mr-3 h-6 w-6" /> Create New Department
        </h2>
        <CreateDepartmentForm centerId={center.id} />
      </div>

      {/* Section to View/Manage Existing Departments */}
      <div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Existing Departments ({departments.length})
        </h2>
        <DepartmentsTable
            centerId={center.id}
            departments={departments}
        />
      </div>
    </div>
  );
}