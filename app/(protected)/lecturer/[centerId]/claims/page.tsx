import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, Claim, ClaimStatus, ClaimType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { LecturerClaimsTable } from '@/components/tables/LecturerClaimsTable';
import { FileText, FilePlus } from 'lucide-react';

type LecturerClaimsPageProps = {
  params: {
    centerId: string;
  };
};

export async function generateMetadata({ params }: LecturerClaimsPageProps): Promise<Metadata> {
  const session = await getCurrentUserSession();
  const center = await prisma.center.findFirst({
    where: {
      id: params.centerId,
      lecturers: { some: { id: session?.userId } }
    },
    select: { name: true },
  });
  
  return {
    title: center ? `My Claims - ${center.name}` : 'My Claims',
    description: `View and manage your submitted claims for ${center?.name || 'your center'}`,
  };
}

export type LecturerClaim = Pick<Claim,
  "id" | "claimType" | "submittedAt" | "processedAt" | "status" 
> & {
  transportDestinationTo?: string | null;
  transportDestinationFrom?: string | null;
  thesisType?: Claim['thesisType'];
  thesisExamCourseCode?: string | null;
};

export default async function LecturerClaimsPage({ params }: LecturerClaimsPageProps) {
  const { centerId } = params;
  const session = await getCurrentUserSession();

  // Authorization Check
  if (session?.role !== Role.LECTURER) {
    redirect('/dashboard');
  }

  const userAssignment = await prisma.user.findFirst({
    where: {
      id: session.userId,
      lecturerCenterId: centerId,
    },
    select: { 
      id: true, 
      lecturerCenter: { 
        select: { 
          name: true 
        } 
      } 
    }
  });

  if (!userAssignment) {
    redirect('/dashboard');
  }

  const centerName = userAssignment.lecturerCenter?.name || 'this center';
  const claims = await getLecturerClaims(session.userId, centerId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900 flex items-center">
              <FileText className="mr-3 h-8 w-8 text-blue-600" />
              My Claims
            </h1>
            <p className="text-blue-700">
              View and manage your submitted claims for <span className="font-medium text-blue-800">{centerName}</span>
            </p>
          </div>
          
          <Button 
            asChild 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={`/lecturer/${centerId}/claims/create`}>
              <FilePlus className="mr-2 h-4 w-4" />
              New Claim
            </Link>
          </Button>
        </div>

        {/* Claims Table */}
        <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
          <LecturerClaimsTable claims={claims} />
        </div>
      </div>
    </div>
  );
}

async function getLecturerClaims(userId: string, centerId: string): Promise<LecturerClaim[]> {
  return await prisma.claim.findMany({
    where: {
      submittedById: userId,
      centerId: centerId,
    },
    select: {
      id: true,
      claimType: true,
      status: true,
      submittedAt: true,
      processedAt: true,
      transportDestinationTo: true,
      transportDestinationFrom: true,
      thesisType: true,
      thesisExamCourseCode: true,
    },
    orderBy: {
      submittedAt: 'desc',
    },
  });
}