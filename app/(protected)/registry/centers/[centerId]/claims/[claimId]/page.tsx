// app/(protected)/registry/centers/[centerId]/claims/[claimId]/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { ClaimDetailsView } from '@/components/forms/ClaimDetailsView';
import type { ClaimWithDetailsForView } from '@/app/(protected)/coordinator/[centerId]/claims/[claimId]/page';

type RegistryClaimDetailPageProps = {
    params: {
        centerId: string;
        claimId: string;
    };
};

export async function generateMetadata({ params }: RegistryClaimDetailPageProps): Promise<Metadata> {
    const session = await getCurrentUserSession();
    if (session?.role !== Role.REGISTRY) {
        return { title: 'Access Denied' };
    }
    
    const claim = await prisma.claim.findFirst({
        where: {
            id: params.claimId,
            centerId: params.centerId,
        },
        select: { 
            claimType: true, 
            center: { select: { name: true } },
            submittedAt: true
        },
    });

    if (!claim) {
        return { title: 'Claim Not Found' };
    }

    const claimType = claim.claimType.toLowerCase().replace('_', ' ');
    return {
        title: `${claimType} Claim | ${claim.center?.name || 'Center'}`,
        description: `View details for ${claimType} claim submitted on ${claim.submittedAt.toLocaleDateString()}`,
    };
}

export default async function RegistryClaimDetailPage({ params }: RegistryClaimDetailPageProps) {
    const { centerId, claimId } = params;
    const session = await getCurrentUserSession();

    // Authorization
    if (!session) redirect('/login');
    if (session.role !== Role.REGISTRY) {
        console.warn(`RegistryClaimDetailPage: Non-registry user (${session.role}) attempting access.`);
        redirect('/dashboard');
    }

    // Fetch claim data
    const claim = await prisma.claim.findUnique({
        where: {
            id: claimId,
            centerId: centerId,
        },
        include: {
            submittedBy: { select: { id: true, name: true, email: true } },
            processedBy: { select: { id: true, name: true, email: true } },
            center: { select: { id: true, name: true, coordinatorId: true } },
            supervisedStudents: true,
        }
    });

    if (!claim) {
        console.warn(`Claim ${claimId} not found in center ${centerId}`);
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <Button variant="outline" size="sm" asChild className="w-fit">
                    <Link href={`/registry/centers/${centerId}/claims`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Claims
                    </Link>
                </Button>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Claim Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Center: <span className="font-medium">{claim.center?.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Claim Details */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <ClaimDetailsView
                    claim={claim}
                    currentCoordinatorId={session.userId}
                />
            </div>
        </div>
    );
}