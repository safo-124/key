import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building, Users } from 'lucide-react';

import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Registry Administration',
  description: 'Admin dashboard for managing centers, users, and overall system settings.',
};

export default async function RegistryDashboardPage() {
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("RegistryDashboardPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  let stats = {
    centerCount: 0,
    coordinatorCount: 0,
    lecturerCount: 0,
  };
  
  try {
    const centerCount = await prisma.center.count();
    const coordinatorCount = await prisma.user.count({ where: { role: Role.COORDINATOR }});
    const lecturerCount = await prisma.user.count({ where: { role: Role.LECTURER }});
    stats = { centerCount, coordinatorCount, lecturerCount };
  } catch (error) {
    console.error("RegistryDashboardPage: Failed to fetch stats:", error);
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-bold">Registry Administration</h1>
        <p className="text-blue-100 mt-2">
          Welcome, Registry Administrator. Manage the core components of the application.
        </p>
      </div>

      {/* Stats Overview Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Centers</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.centerCount}
            </div>
            <p className="text-xs text-blue-600/70">Currently managed centers</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Coordinators</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.coordinatorCount}
            </div>
            <p className="text-xs text-blue-600/70">Users with Coordinator role</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Lecturers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.lecturerCount}
            </div>
            <p className="text-xs text-blue-600/70">Users with Lecturer role</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center text-blue-700">
              <Building className="mr-2 h-5 w-5 text-blue-500" /> 
              Center Management
            </CardTitle>
            <CardDescription className="text-blue-600/80">
              Create, view, edit, and manage centers and their assigned coordinators and lecturers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Link href="/registry/centers">Go to Center Management</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center text-blue-700">
              <Users className="mr-2 h-5 w-5 text-blue-500" /> 
              User Management
            </CardTitle>
            <CardDescription className="text-blue-600/80">
              View, create, edit roles, and manage all users in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              disabled 
              className="bg-blue-50 text-blue-400 cursor-not-allowed shadow-inner"
            >
              Coming Soon
            </Button>
            <p className="text-xs text-blue-500/70 mt-2">Functionality under development</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}