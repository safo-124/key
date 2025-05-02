import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlusCircle, Users } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/tables/UsersTable';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Comprehensive user administration dashboard for managing system access and roles.',
};

export type UserWithAssignment = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'> & {
  coordinatedCenter: { id: string; name: string } | null;
  lecturerCenter: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
};

export default async function RegistryUsersPage() {
  const session = await getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("RegistryUsersPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  const users: UserWithAssignment[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      coordinatedCenter: {
        select: { id: true, name: true },
      },
      lecturerCenter: {
        select: { id: true, name: true },
      },
      department: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-blue-800">User Management</h1>
              <p className="text-sm text-blue-600 mt-1">
                Administer system users, roles, and permissions
              </p>
            </div>
          </div>
          
          <Button asChild className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/registry/users/create" className="flex items-center justify-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New User
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <h3 className="text-sm font-medium text-blue-600">Total Users</h3>
          <p className="mt-1 text-3xl font-semibold text-blue-800">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <h3 className="text-sm font-medium text-blue-600">Coordinators</h3>
          <p className="mt-1 text-3xl font-semibold text-blue-800">
            {users.filter(u => u.role === Role.COORDINATOR).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <h3 className="text-sm font-medium text-blue-600">Lecturers</h3>
          <p className="mt-1 text-3xl font-semibold text-blue-800">
            {users.filter(u => u.role === Role.LECTURER).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden">
        <UsersTable data={users} />
      </div>
    </div>
  );
}