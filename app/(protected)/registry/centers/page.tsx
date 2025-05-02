import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { CentersTable } from '@/components/tables/CentersTable';
import { Metadata } from 'next';
import { getCurrentUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Manage Centers',
  description: 'View and manage centers.',
};

export type CenterWithCoordinator = {
  id: string;
  name: string;
  createdAt: Date;
  coordinator: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

export default async function RegistryCentersPage() {
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("RegistryCentersPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  const centers: CenterWithCoordinator[] = await prisma.center.findMany({
    include: {
      coordinator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(`RegistryCentersPage: Fetched ${centers.length} centers.`);

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-sm">
      {/* Header Section with Gradient Background */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manage Centers</h1>
          <p className="text-blue-100 mt-1">
            View and manage all centers in the system
          </p>
        </div>
        
        <Button 
          asChild 
          className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md transition-colors"
        >
          <Link href="/registry/centers/create" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> 
            <span>Create New Center</span>
          </Link>
        </Button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-600">Total Centers</p>
          <p className="text-2xl font-bold text-blue-800">{centers.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-600">Active Centers</p>
          <p className="text-2xl font-bold text-blue-800">{centers.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-600">With Coordinators</p>
          <p className="text-2xl font-bold text-blue-800">
            {centers.filter(c => c.coordinator !== null).length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm">
        <CentersTable data={centers} />
      </div>

      {/* Help Text */}
      <div className="text-sm text-blue-600/80 text-center p-4">
        Tip: Click on any center to view detailed information and manage settings.
      </div>
    </div>
  );
}