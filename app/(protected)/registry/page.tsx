import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building, Users, BarChart3 } from 'lucide-react'; // Icons for cards

import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import prisma from '@/lib/prisma'; // To fetch stats
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Registry Administration',
  description: 'Admin dashboard for managing centers, users, and overall system settings.',
};

// Registry Dashboard Page Component (Server Component)
export default async function RegistryDashboardPage() {
  // Role check for security
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("RegistryDashboardPage: Non-registry user attempting access.");
    redirect('/dashboard'); // Redirect if not registry admin
  }

  // Fetch some basic stats for display
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
    console.log("RegistryDashboardPage: Fetched stats - ", stats);
  } catch (error) {
    console.error("RegistryDashboardPage: Failed to fetch stats:", error);
    // Continue without stats if fetching fails
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registry Administration</h1>
      <p className="text-muted-foreground">
        Welcome, Registry Administrator. Use this dashboard to manage the core components of the application.
      </p>

      {/* Stats Overview Section */}
      <div className="grid gap-4 md:grid-cols-3">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
             <Building className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{stats.centerCount}</div>
             <p className="text-xs text-muted-foreground">Currently managed centers</p>
           </CardContent>
         </Card>
          <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Coordinators</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{stats.coordinatorCount}</div>
             <p className="text-xs text-muted-foreground">Users with Coordinator role</p>
           </CardContent>
         </Card>
          <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{stats.lecturerCount}</div>
              <p className="text-xs text-muted-foreground">Users with Lecturer role</p>
           </CardContent>
         </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5" /> Center Management</CardTitle>
            <CardDescription>Create, view, edit, and manage centers and their assigned coordinators and lecturers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/registry/centers">Go to Center Management</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> User Management (TBD)</CardTitle>
            <CardDescription>View, create, edit roles, and manage all users (Coordinators, Lecturers) in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Go to User Management</Button>
             <p className="text-xs text-muted-foreground mt-2">Functionality coming soon.</p>
          </CardContent>
        </Card>

         {/* Add more cards for other potential registry functions */}
         {/* <Card> ... </Card> */}
      </div>
    </div>
  );
}
