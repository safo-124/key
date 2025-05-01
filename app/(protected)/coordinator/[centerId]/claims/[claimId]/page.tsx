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
import { ClaimDetailsView } from '@/components/forms/ClaimDetailsView';

// Define props type including URL parameters
type ViewClaimPageProps = {
    params: {
        centerId: string; // Center ID from the URL
        claimId: string;  // Claim ID from the URL
    };
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
export async function generateMetadata({ params }: ViewClaimPageProps): Promise<Metadata> {
    const session = getCurrentUserSession();
    // Fetch minimal data for title, checking access implicitly
    const claim = await prisma.claim.findFirst({
        where: {
            id: params.claimId,
            centerId: params.centerId,
            // Ensure the center is coordinated by the current user (basic check)
            center: {
                coordinatorId: session?.role === Role.COORDINATOR ? session.userId : undefined
            }
         },
        select: { claimType: true, center: { select: { name: true } } }, // Fetch type for better title
    });

    const claimTypeString = claim?.claimType ? ` (${claim.claimType.replace('_', ' ')})` : '';
    return {
        title: claim ? `Review Claim ${claimTypeString}` : 'Review Claim',
        description: `Review details for claim ${params.claimId} in center ${claim?.center?.name || params.centerId}.`,
    };
}


// The View Claim Details Page component for Coordinators (Server Component)
export default async function ViewClaimPage({ params }: ViewClaimPageProps) {
    const { centerId, claimId } = params; // Extract IDs from URL
    const session = getCurrentUserSession(); // Get current user session

    // --- Authorization Check ---
    // 1. Must be a Coordinator
    if (session?.role !== Role.COORDINATOR) {
        console.warn(`ViewClaimPage: Non-coordinator user (Role: ${session?.role}) attempting access.`);
        redirect('/dashboard'); // Redirect non-coordinators
    }

    // 2. Fetch the specific claim details, ensuring it belongs to the coordinator's center
    // Fetch all data required by the ClaimDetailsView component
    const claim: ClaimWithDetailsForView | null = await prisma.claim.findUnique({
        where: { id: claimId },
        include: {
            submittedBy: { select: { id: true, name: true, email: true } },
            processedBy: { select: { id: true, name: true, email: true } }, // Include email if needed
            center: { select: { id: true, name: true, coordinatorId: true } }, // Need coordinatorId for validation
            supervisedStudents: true, // Include all fields for supervised students
        }
    });

    // 3. Validate fetched data
    //    a) Claim must exist
    //    b) Claim's centerId must match the URL centerId
    //    c) The center's coordinatorId must match the logged-in user's ID
    if (!claim || claim.centerId !== centerId || claim.center?.coordinatorId !== session.userId) {
        console.warn(`ViewClaimPage: Coordinator ${session.userId} failed access check for claim ${claimId} in center ${centerId}.`);
        notFound(); // Show "Not Found" page
    }

    console.log(`ViewClaimPage: Displaying details for ${claim.claimType} claim ${claim.id} in center ${claim.center.name}`);

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
            {/* Pass the fetched claim data and necessary session info */}
            <ClaimDetailsView
                claim={claim}
                currentCoordinatorId={session.userId} // Pass the coordinator's ID for potential use in client actions
            />

            {/* Note: The detailed rendering logic (Cards, Badges, Tables, Action Buttons) */}
            {/* is now handled within ClaimDetailsView */}

        </div>
    );
}
