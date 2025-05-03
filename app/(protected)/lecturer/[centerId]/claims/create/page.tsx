import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FilePlus } from 'lucide-react';

import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateClaimForm } from '@/components/forms/CreateClaimForm';

type CreateClaimPageProps = {
    params: {
        centerId: string;
    };
};

export async function generateMetadata({ params }: CreateClaimPageProps): Promise<Metadata> {
  return {
    title: 'Submit New Claim',
    description: `Submit a new claim for center ${params.centerId}.`,
  };
}

export default async function CreateClaimPage({ params }: CreateClaimPageProps) {
  const { centerId } = params;
  const session = getCurrentUserSession();

  if (session?.role !== Role.LECTURER) {
    console.warn(`CreateClaimPage: Non-lecturer user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard');
  }

  const userAssignment = await prisma.user.findFirst({
      where: {
          id: session.userId,
          lecturerCenterId: centerId,
      },
      select: { id: true }
  });

  if (!userAssignment) {
      console.warn(`CreateClaimPage: Lecturer ${session.userId} failed access check for center ${centerId}. Redirecting.`);
      redirect('/dashboard');
  }

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="group" asChild>
            <Link href={`/lecturer/${centerId}`} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Center ID: {centerId}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <FilePlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Submit New Claim</CardTitle>
                <CardDescription className="text-blue-100/90">
                  Complete the form below to submit your claim for review
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Claim Information</h3>
              <p className="text-sm text-gray-500 mt-1">
                Please fill out all required fields carefully. Your claim will be reviewed by the center coordinator.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <CreateClaimForm />
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact your center coordinator for assistance with claim submissions.
          </p>
        </div>
      </div>
    </div>
  );
}