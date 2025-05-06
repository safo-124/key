// app/(protected)/coordinator/[centerId]/claims/[claimId]/page.tsx

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession, UserSession } from '@/lib/auth';
import { Role, Claim, User, SupervisedStudent, Center } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ClaimDetailsView } from '@/components/forms/ClaimDetailsView';
import React from 'react';

export type ClaimWithDetailsForView = Claim & {
  submittedBy: Pick<User, 'id' | 'name' | 'email'> | null;
  processedBy?: Pick<User, 'id' | 'name' | 'email'> | null;
  center: Pick<Center, 'id' | 'name' | 'coordinatorId'> | null;
  supervisedStudents?: SupervisedStudent[];
};

type PageParams = {
  params: {
    centerId: string;
    claimId: string;
  };
};

// ------------------------
// Generate Metadata
// ------------------------
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const session: UserSession | null = getCurrentUserSession();

  if (session?.role !== Role.COORDINATOR) {
    return { title: 'Access Denied' };
  }

  try {
    const claim = await prisma.claim.findFirst({
      where: {
        id: params.claimId,
        centerId: params.centerId,
        center: { coordinatorId: session.userId },
      },
      select: {
        claimType: true,
        center: { select: { name: true } },
      },
    });

    const claimTypeString = claim?.claimType ? ` (${claim.claimType.replace('_', ' ')})` : '';
    return {
      title: claim ? `Review Claim${claimTypeString}` : 'Review Claim',
      description: `Review details for claim ${params.claimId} in center ${claim?.center?.name || params.centerId}.`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Claim',
      description: 'Could not load claim details.',
    };
  }
}

// ------------------------
// View Claim Page
// ------------------------
export default async function ViewClaimPage({ params }: PageParams) {
  const { centerId, claimId } = params;
  const session: UserSession | null = getCurrentUserSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== Role.COORDINATOR) {
    redirect('/dashboard');
  }

  let claim: ClaimWithDetailsForView | null = null;

  try {
    claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        submittedBy: { select: { id: true, name: true, email: true } },
        processedBy: { select: { id: true, name: true, email: true } },
        center: { select: { id: true, name: true, coordinatorId: true } },
        supervisedStudents: true,
      },
    });
  } catch (error) {
    console.error('Error fetching claim:', error);
  }

  if (
    !claim ||
    claim.centerId !== centerId ||
    claim.center?.coordinatorId !== session.userId
  ) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/coordinator/${centerId}/claims`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Claims List
        </Link>
      </Button>

      <ClaimDetailsView
        claim={claim}
        currentCoordinatorId={session.userId}
      />
    </div>
  );
}

