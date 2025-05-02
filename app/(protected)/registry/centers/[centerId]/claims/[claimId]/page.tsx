// app/(protected)/registry/centers/[centerId]/claims/[claimId]/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, Claim, User, SupervisedStudent, Center, ClaimStatus } from '@prisma/client'; // Import necessary Prisma types
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSearch } from 'lucide-react'; // Use a relevant icon

// Import the Client Component that handles display and printing
// ** Ensure this path is correct for your project structure **
import { ClaimDetailsView } from '@/components/forms/ClaimDetailsView';
// Import the type definition used by ClaimDetailsView
// ** Ensure this path is correct for your project structure **
// Reusing the type from coordinator view as it includes necessary fields
import type { ClaimWithDetailsForView } from '@/app/(protected)/coordinator/[centerId]/claims/[claimId]/page';

// Define props type including URL parameters
type RegistryClaimDetailPageProps = {
    params: {
        centerId: string; // Center ID from the URL
        claimId: string;  // Claim ID from the URL
    };
};

// Function to generate dynamic metadata
export async function generateMetadata({ params }: RegistryClaimDetailPageProps): Promise<Metadata> {
    const session = getCurrentUserSession();
    // Verify user is Registry before fetching data for metadata
    if (session?.role !== Role.REGISTRY) {
        return { title: 'Access Denied' };
    }
    // Fetch minimal claim data for title generation
    const claim = await prisma.claim.findFirst({
        where: {
            id: params.claimId,
            centerId: params.centerId, // Ensure claim belongs to the specified center
         },
        select: { claimType: true, center: { select: { name: true } } },
    });

    if (!claim) {
        return { title: 'Claim Not Found' };
    }

    const claimTypeString = claim.claimType ? ` (${claim.claimType.replace('_', ' ')})` : '';
    return {
        title: `View Claim ${claimTypeString} - ${claim.center?.name || 'Center'}`,
        description: `View details for claim ${params.claimId} from center ${claim.center?.name || params.centerId}.`,
    };
}


// The main Registry Claim Detail Page component (Server Component)
export default async function RegistryClaimDetailPage({ params }: RegistryClaimDetailPageProps) {
    const { centerId, claimId } = params;
    const session = getCurrentUserSession();

    // --- Authorization Check ---
    if (!session) redirect('/login');
    // ** Crucial Check: Only REGISTRY role allowed **
    if (session.role !== Role.REGISTRY) {
        console.warn(`RegistryClaimDetailPage: Non-registry user (Role: ${session.role}) attempting access.`);
        redirect('/dashboard'); // Redirect unauthorized roles
    }

    // Fetch the specific claim details, ensuring it belongs to the specified center
    // Include all relations needed by ClaimDetailsView
    const claim: ClaimWithDetailsForView | null = await prisma.claim.findUnique({
        where: {
            id: claimId,
            centerId: centerId, // Ensure claim belongs to the center in the URL
        },
        include: {
            submittedBy: { select: { id: true, name: true, email: true } },
            processedBy: { select: { id: true, name: true, email: true } },
            center: { select: { id: true, name: true, coordinatorId: true } }, // Include center details
            supervisedStudents: true, // Include supervised students if applicable
        }
    });

    // Validate fetched data
    if (!claim) {
        console.warn(`RegistryClaimDetailPage: Claim ${claimId} not found or does not belong to center ${centerId}.`);
        notFound(); // Show "Not Found" page
    }

    console.log(`RegistryClaimDetailPage: Displaying details for claim ${claim.id} from center ${claim.center?.name}`);

    // --- Render Page ---
    return (
        <div className="space-y-6">
            {/* Back Button & Header */}
            <div className="flex items-center justify-between gap-4">
                 <Button variant="outline" size="sm" asChild>
                    {/* Link back to the claims list for this specific center */}
                    <Link href={`/registry/centers/${centerId}/claims`}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Claims List
                    </Link>
                </Button>
                 {/* Optional: Add page title here if desired, or rely on metadata */}
                 <h1 className="text-xl font-semibold text-muted-foreground hidden sm:block">
                    Claim Details
                 </h1>
            </div>


            {/* --- Render the Client Component for Display & Print --- */}
            {/* Pass the fetched claim data and the current user's ID */}
            {/* The ClaimDetailsView component handles rendering and printing */}
            {/* The ClaimActionButtonsClient within it handles showing/hiding actions based on role */}
            <ClaimDetailsView
                claim={claim}
                currentCoordinatorId={session.userId} // Pass Registry user ID here (used by action buttons for processorId)
                // Note: ClaimActionButtonsClient needs to correctly interpret this ID based on the role prop passed in ClaimsTable
                // Or, modify ClaimDetailsView/ClaimActionButtonsClient to accept userRole directly if needed
            />

        </div>
    );
}
