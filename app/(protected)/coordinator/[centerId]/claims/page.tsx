// app/(protected)/coordinator/[centerId]/claims/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus, Prisma, Claim, User, ThesisType, ClaimType } from '@prisma/client'; // Import necessary types
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ListFilter, FileText, Search } from 'lucide-react'; // Added Search icon
import { Card, CardContent } from "@/components/ui/card";

// Import the client component for search input
// ** Ensure this path is correct for your project structure **
import { ClaimSearchInput } from '@/components/claims/ClaimSearchInput';
// Import the table component to display claims
// ** Ensure this path is correct for your project structure **
import { ClaimsTable } from '@/components/tables/ClaimsTable';

// Define props type including URL parameters and searchParams
type CoordinatorClaimsPageProps = {
    params: {
        centerId: string; // Center ID from the URL
    };
    searchParams?: { // Optional search parameters from URL query
        query?: string; // Search query
        page?: string; // For pagination (optional)
    };
};

// Define the type for claim data passed to the ClaimsTable component.
export type ClaimForCoordinatorView = Pick<Claim,
    'id' |
    'claimType' |
    'status' |
    'submittedAt' |
    'processedAt' |
    'transportAmount' // Keep specific transport amount (might be null)
> & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'>; // Include submitter's ID, name, and email
    // Add specific fields useful for identifying the claim in the list view
    teachingDate?: Date | null;
    transportDestinationTo?: string | null;
    transportDestinationFrom?: string | null;
    thesisType?: ThesisType | null;
    thesisExamCourseCode?: string | null;
};


// Function to generate dynamic metadata
export async function generateMetadata({ params }: CoordinatorClaimsPageProps): Promise<Metadata> {
    const session = getCurrentUserSession();
    // Fetch center name, ensure coordinator owns it for metadata generation
    const center = await prisma.center.findFirst({
        where: { id: params.centerId, coordinatorId: session?.userId },
        select: { name: true },
    });
    return {
        title: `Manage Claims - ${center?.name || 'Center'}`,
        description: `Review and manage claims submitted to the ${center?.name || 'assigned'} center.`,
    };
}

// The main Coordinator Claims List Page component (Server Component)
export default async function CoordinatorClaimsPage({ params, searchParams }: CoordinatorClaimsPageProps) {
    const { centerId } = params;
    const session = getCurrentUserSession();

    // --- Authorization ---
    if (!session) redirect('/login');
    if (session.role !== Role.COORDINATOR) redirect('/dashboard');

    // Verify coordinator is assigned to this center
    const center = await prisma.center.findUnique({
        where: { id: centerId },
        select: { name: true, coordinatorId: true }
    });

    // If the center is not found OR the coordinator doesn't match, deny access.
    if (!center || center.coordinatorId !== session.userId) {
        console.warn(`CoordinatorClaimsPage: Coordinator ${session.userId} failed access check for center ${centerId}.`);
        notFound(); // Use notFound for access denied/missing resource
    }

    // --- Search Logic ---
    const searchQuery = searchParams?.query || ''; // Get search query from URL
    console.log(`[Server Page] Current Search Query: "${searchQuery}"`);

    // --- Data Fetching ---
    // Construct the base where clause, always filtering by centerId
    const whereClause: Prisma.ClaimWhereInput = {
        centerId: centerId,
    };

    // Conditionally add the OR clause for search
    if (searchQuery) {
        const orConditions = [
            // Case-insensitive search on relevant fields
            { id: { contains: searchQuery } }, // Removed mode: 'insensitive'
            { submittedBy: { name: { contains: searchQuery } } },
            { submittedBy: { email: { contains: searchQuery } } },
            // Attempt enum search (convert query to potential enum value)
            { claimType: { equals: Object.values(ClaimType).find(val => val.toLowerCase() === searchQuery.toLowerCase()) } },
            { transportDestinationTo: { contains: searchQuery } },
            { transportDestinationFrom: { contains: searchQuery } },
            { thesisExamCourseCode: { contains: searchQuery } },
            { status: { equals: Object.values(ClaimStatus).find(val => val.toLowerCase() === searchQuery.toLowerCase()) } },
        ].filter(condition => // Filter out conditions where enum conversion resulted in undefined
             (condition.claimType && condition.claimType.equals !== undefined) ||
             (condition.status && condition.status.equals !== undefined) ||
             (condition.id || condition.submittedBy || condition.transportDestinationTo || condition.transportDestinationFrom || condition.thesisExamCourseCode)
        );

        // Only add OR clause if there are valid conditions to search for
        if (orConditions.length > 0) {
            whereClause.OR = orConditions;
        } else {
             // If search query exists but results in no valid OR conditions (e.g., searching for non-existent enum),
             // force no results by adding an impossible condition within the main 'where'.
             // This ensures the centerId filter is still respected.
             whereClause.id = { equals: 'impossible_id_to_prevent_error' };
        }
    }

    // *** ADDED LOG: Log the final whereClause being used ***
    console.log("[Server Page] Using whereClause:", JSON.stringify(whereClause, null, 2));

    let claims: ClaimForCoordinatorView[] = [];
    try {
        claims = await prisma.claim.findMany({
            where: whereClause, // Use the constructed where clause
            select: { // Select only the fields needed for the table display and actions
                id: true,
                claimType: true,
                status: true,
                submittedAt: true,
                processedAt: true,
                transportAmount: true,
                submittedBy: {
                    select: { id: true, name: true, email: true }
                },
                teachingDate: true,
                transportDestinationTo: true,
                transportDestinationFrom: true,
                thesisType: true,
                thesisExamCourseCode: true,
            },
            orderBy: [
                 // Keep custom sorting: PENDING first, then others by submission date descending
                 { status: 'asc' },
                 { submittedAt: 'desc' }
            ]
            // Add pagination later if needed (take, skip)
        });
        console.log(`CoordinatorClaimsPage: Displaying ${claims.length} claims for center ${center.name} matching query "${searchQuery}"`);

    } catch (error) {
        console.error("CoordinatorClaimsPage: Error fetching claims:", error);
        // Handle error display appropriately
    }

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-white to-red-50 min-h-screen">
            {/* Page Header with Gradient Background */}
            <div className="bg-gradient-to-r from-blue-600 to-red-500 p-6 rounded-xl shadow-lg text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center">
                            <FileText className="mr-3 h-7 w-7" />
                            Claims for Review
                        </h1>
                        <p className="text-lg text-blue-100 mt-1">
                            Center: <span className="font-semibold">{center.name}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Input with Gradient Border */}
            <div className="flex justify-start pt-2 pb-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-blue-200/50 p-1 bg-gradient-to-r from-white to-red-50">
                    <ClaimSearchInput initialQuery={searchQuery} />
                </div>
            </div>

            {/* Claims Data Display */}
            {claims.length > 0 ? (
                <div className="rounded-xl border border-blue-200/50 bg-white shadow-sm overflow-hidden">
                    {/* Ensure ClaimsTable component exists and accepts these props */}
                    <ClaimsTable
                        centerId={centerId} // Pass the correct centerId from params
                        claims={claims}
                        currentUserId={session.userId}
                        userRole={session.role}
                    />
                </div>
            ) : (
                <Card className="mt-4 border-dashed border-blue-300 bg-gradient-to-br from-white to-red-50">
                    <CardContent className="pt-6">
                        <div className="text-center text-blue-800/70">
                            <Search className="mx-auto h-12 w-12 mb-4 text-blue-500/50" />
                            <p className="font-medium">
                                {searchQuery ? `No claims found matching "${searchQuery}".` : "No claims found for this center."}
                            </p>
                            {searchQuery && (
                                <Button
                                    variant="link"
                                    asChild
                                    className="mt-2 bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent"
                                >
                                    <Link href={`/coordinator/${centerId}/claims`}>Clear Search</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
