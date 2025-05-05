// app/(protected)/coordinator/[centerId]/claims/[claimId]/page.tsx

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, Claim, User, SupervisedStudent, Center } from '@prisma/client'; // Keep necessary Prisma types
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Import the Client Component that handles display and printing
// Make sure the path is correct for your project structure
import { ClaimDetailsView } from '@/components/forms/ClaimDetailsView'; // Adjust if path changed


// Include both params and optional searchParams
type CoordinatorClaimDetailPageProps = {
    params: {
        centerId: string;
        claimId: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined }; // Standard searchParams type
};

// Define the type for the detailed claim data needed by ClaimDetailsView
// Ensure this includes all relations and fields required by the client component
export type ClaimWithDetailsForView = Claim & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'> | null; // Allow null in case user is deleted
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null; // Optional processor details
    center: Pick<Center, 'id' | 'name' | 'coordinatorId'> | null; // Include coordinatorId for auth check
    supervisedStudents?: SupervisedStudent[]; // Include supervised students array
};


// Function to generate dynamic metadata for the page
// Keep the explicit inline typing for generateMetadata props
export async function generateMetadata(
    { params }: { params: { centerId: string; claimId: string } }
): Promise<Metadata> {
    const session = getCurrentUserSession();
    // Basic check: Ensure user is likely a coordinator before fetching
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
// *** FIXED: Use the CoordinatorClaimDetailPageProps type defined above ***
export default async function ViewClaimPage(
    { params /*, searchParams */ }: CoordinatorClaimDetailPageProps // Use the defined Props type
) {
    // We don't use searchParams here, but including it in the type might satisfy the build
    const { centerId, claimId } = params; // Extract IDs from URL params
    const session = getCurrentUserSession(); // Get current user session

    // --- Authorization Check ---
    console.log("[ViewClaimPage] Session:", session);
    console.log("[ViewClaimPage] Params:", params);

    // 1. Must be logged in
    if (!session) {
        console.log("[ViewClaimPage] No session, redirecting to login.");
        redirect('/login');
    }
    // 2. Must be a Coordinator
    if (session.role !== Role.COORDINATOR) {
        console.warn(`[ViewClaimPage] Non-coordinator user (Role: ${session?.role}) attempting access. Redirecting.`);
        redirect('/dashboard');
    }

    let claim: ClaimWithDetailsForView | null = null;
    try {
        // 3. Fetch the specific claim details
        console.log(`[ViewClaimPage] Fetching claim with ID: ${claimId}`);
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

    // 4. Validate fetched data
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

    // If all checks pass:
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
                claim={claim}
                currentCoordinatorId={session.userId}
            />

        </div>
    );
}
