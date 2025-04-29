import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FilePlus } from 'lucide-react';

import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import prisma from '@/lib/prisma'; // Needed to verify center access
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateClaimForm } from '@/components/forms/CreateClaimForm'; // We'll create this next

export const metadata: Metadata = {
  title: 'Submit New Claim',
  description: 'Submit a new claim for review.',
};

// Define props including URL parameters
type CreateClaimPageProps = {
    params: { centerId: string };
};

// Create Claim Page Component (Server Component)
export default async function CreateClaimPage({ params }: CreateClaimPageProps) {
  const { centerId } = params;
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  // 1. Must be a Lecturer
  // 2. Must be assigned to THIS centerId
  if (session?.role !== Role.LECTURER) {
    redirect('/dashboard'); // Redirect non-lecturers
  }

  // Verify the lecturer is actually assigned to this specific center
  const userAssignment = await prisma.user.findFirst({
      where: {
          id: session.userId,
          lecturerCenterId: centerId, // Check assignment matches URL
      },
      select: { id: true } // Only need to confirm existence
  });

  if (!userAssignment) {
      console.warn(`CreateClaimPage: Lecturer ${session.userId} failed access check for center ${centerId}.`);
      // Redirect if they try to access create page for a center they aren't in
      redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
       {/* Back Button */}
       <Button variant="outline" size="sm" asChild>
        {/* Link back to the claims list for this center */}
        <Link href={`/lecturer/${centerId}/claims`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Claims
        </Link>
      </Button>

      {/* Main Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><FilePlus className="mr-2 h-5 w-5" /> Submit New Claim</CardTitle>
          <CardDescription>
            Fill out the details below to submit a new claim for approval by your center coordinator.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Render the form component */}
           <CreateClaimForm />
        </CardContent>
      </Card>
    </div>
  );
}