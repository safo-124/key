import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, Department } from '@prisma/client';
import { CreateDepartmentForm } from '@/components/forms/CreateDepartmentForm';
import { DepartmentsTable } from '@/components/tables/DepartmentsTable';
import { Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type CoordinatorDepartmentsPageProps = {
  params: {
    centerId: string;
  };
};

export async function generateMetadata({ params }: CoordinatorDepartmentsPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({ 
    where: { id: params.centerId }, 
    select: { name: true } 
  });
  
  return {
    title: center ? `Departments - ${center.name}` : 'Center Departments',
    description: `Manage academic departments for ${center?.name || 'your center'}`,
  };
}

export type DepartmentWithLecturerCount = Department & {
  _count: { lecturers: number };
};

export default async function CoordinatorDepartmentsPage({ 
  params 
}: CoordinatorDepartmentsPageProps) {
  const session = await getCurrentUserSession();
  const { centerId } = params;

  // Authorization Check
  if (!session || session.role !== Role.COORDINATOR) {
    redirect('/dashboard');
  }

  const center = await prisma.center.findUnique({ 
    where: { 
      id: centerId, 
      coordinatorId: session.userId 
    }, 
    select: { 
      id: true, 
      name: true 
    } 
  });
  
  if (!center) {
    redirect('/dashboard');
  }

  const departments = await prisma.department.findMany({
    where: { centerId },
    include: {
      _count: { select: { lecturers: true } }
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Department Management
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Manage academic departments for <span className="font-medium">{center.name}</span>
        </p>
      </div>

      {/* Create Department Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              Create New Department
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CreateDepartmentForm centerId={center.id} />
        </CardContent>
      </Card>

      {/* Existing Departments Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Existing Departments
          </h2>
          <p className="text-sm text-muted-foreground">
            {departments.length} department{departments.length !== 1 ? 's' : ''} in this center
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <DepartmentsTable
              centerId={center.id}
              departments={departments}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}