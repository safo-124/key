import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';

import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from '@/components/forms/CreateUserForm'; // We'll create this next

// Metadata for the page
export const metadata: Metadata = {
  title: 'Create New User',
  description: 'Create a new Coordinator or Lecturer user account.',
};

// The Create User Page component (Server Component)
export default async function CreateUserPage() {
  // Role check for security
  const session = getCurrentUserSession();
  if (session?.role !== Role.REGISTRY) {
    console.warn("CreateUserPage: Non-registry user attempting access.");
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
       {/* Back Button */}
       <Button variant="outline" size="sm" asChild>
        <Link href="/registry/users">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users List
        </Link>
      </Button>

      {/* Main Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><UserPlus className="mr-2 h-5 w-5" /> Create New User</CardTitle>
          <CardDescription>
            Enter the details for the new user and assign their role (Coordinator or Lecturer).
            The user can change their password after logging in for the first time.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Render the form component */}
           <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
