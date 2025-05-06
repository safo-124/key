// app/(protected)/coordinator/[centerId]/claims/[claimId]/page.tsx

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
// Assuming UserSession is the correct type returned by getCurrentUserSession
import { getCurrentUserSession, UserSession } from '@/lib/auth';
import { Role, Claim, User, SupervisedStudent, Center } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ClaimDetailsView } from '@/components/forms/ClaimDetailsView'; // Adjust path if needed
import React from 'react';

// Define the standard Props type for a page component
// Use a non-Promise type for params since we'll await it properly
interface PageProps {
    params: { centerId: string; claimId: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

// Define the type for the detailed claim data needed by ClaimDetailsView
export type ClaimWithDetailsForView = Claim & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'> | null;
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null;
    center: Pick<Center, 'id' | 'name' | 'coordinatorId'> | null;
    supervisedStudents?: SupervisedStudent[];
};

// Function to generate dynamic metadata for the page
export async function generateMetadata(
    { params }: { params: { centerId: string; claimId: string } }
): Promise<Metadata> {
    // Use synchronous getCurrentUserSession based on lib/auth.ts code
    const session: UserSession | null = getCurrentUserSession();

    if (session?.role !== Role.COORDINATOR) {
        return { title: "Access Denied" };
    }
    try {
        const claim = await prisma.claim.findFirst({
            where: {
                id: params.claimId,
                centerId: params.centerId,
                center: {
                    coordinatorId: session.userId
                }
            },
            select: { claimType: true, center: { select: { name: true } } },
        });

        const claimTypeString = claim?.claimType ? ` (${claim.claimType.replace('_', ' ')})` : '';
        return {
            title: claim ? `Review Claim ${claimTypeString}` : 'Review Claim',
            description: `Review details for claim ${params.claimId} in center ${claim?.center?.name || params.centerId}.`,
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Error Loading Claim",
            description: "Could not load claim details.",
        };
    }
}

// The View Claim Details Page component for Coordinators (Server Component)
export default async function ViewClaimPage({ params, searchParams }: PageProps) {
    // Destructure directly from params (no need to await)
    const { centerId, claimId } = params;
    
    // Use synchronous getCurrentUserSession based on lib/auth.ts code
    const session: UserSession | null = getCurrentUserSession();

    // --- Authorization Check ---
    console.log("[ViewClaimPage] Session:", session);
    console.log("[ViewClaimPage] Params:", params);

    if (!session) {
        console.log("[ViewClaimPage] No session, redirecting to login.");
        redirect('/login');
    }
    if (session.role !== Role.COORDINATOR) {
        console.warn(`[ViewClaimPage] Non-coordinator user (Role: ${session?.role}) attempting access. Redirecting.`);
        redirect('/dashboard');
    }

    let claim = null; // Initialize as null
    try {
        console.log(`[ViewClaimPage] Fetching claim with ID: ${claimId}`);
        // Let TypeScript infer the type from the Prisma query result
        claim = await prisma.claim.findUnique({
            where: { id: claimId },
            include: {
                submittedBy: { select: { id: true, name: true, email: true } },
                processedBy: { select: { id: true, name: true, email: true } },
                center: { select: { id: true, name: true, coordinatorId: true } },
                supervisedStudents: true,
            }
        });
        console.log("[ViewClaimPage] Fetched Claim Data:", claim);
    } catch (error) {
         console.error("[ViewClaimPage] Error fetching claim data:", error);
    }

    // --- Validation ---
    if (!claim) {
         console.warn(`[ViewClaimPage] Claim ${claimId} not found. Triggering notFound().`);
         notFound();
    } else if (claim.centerId !== centerId) {
         console.warn(`[ViewClaimPage] Claim's centerId (${claim.centerId}) does not match URL centerId (${centerId}). Triggering notFound(). Access denied.`);
         notFound();
    } else if (claim.center?.coordinatorId !== session.userId) {
         console.warn(`[ViewClaimPage] Claim's center coordinatorId (${claim.center?.coordinatorId}) does not match session userId (${session.userId}). Triggering notFound(). Access denied.`);
         notFound();
    }

    console.log(`[ViewClaimPage] Access validated. Displaying details for ${claim.claimType} claim ${claim.id} in center ${claim.center?.name}`);

    // --- Render Page ---
    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="outline" size="sm" asChild>
                <Link href={`/coordinator/${centerId}/claims`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Claims List
                </Link>
            </Button>

            {/* --- Render the Client Component --- */}
            <ClaimDetailsView
                claim={claim as ClaimWithDetailsForView}
                currentCoordinatorId={session.userId} // Changed from session.role to session.userId
            />
        </div>
    );
}
