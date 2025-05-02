// app/(protected)/registry/centers/[centerId]/claims/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus, Prisma, Claim, User, ThesisType, ClaimType } from '@prisma/client'; // Import necessary types
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileText, Search, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Card, CardContent } from "@/components/ui/card";

// Import the client component for search input
// ** Ensure this path is correct for your project structure **
import { ClaimSearchInput } from '@/components/claims/ClaimSearchInput';
// Import the table component to display claims
// ** Ensure this path is correct for your project structure **
// NOTE: ClaimsTable must be adapted to hide actions for Registry role
import { ClaimsTable } from '@/components/tables/ClaimsTable';
// Import the type definition used by ClaimsTable
// ** Ensure this path is correct for your project structure **
import { ClaimForCoordinatorView } from '@/app/(protected)/coordinator/[centerId]/claims/page'; // Reuse type from coordinator view for now

// Define props type including URL parameters and searchParams
type RegistryCenterClaimsPageProps = {
    params: {
        centerId: string; // Center ID from the URL
    };
    searchParams?: { // Optional search parameters from URL query
        query?: string; // Search query
        page?: string; // For pagination (optional)
    };
};

// Function to generate dynamic metadata
export async function generateMetadata({ params }: RegistryCenterClaimsPageProps): Promise<Metadata> {
    const session = getCurrentUserSession();
    // Verify user is Registry before fetching data for metadata
    if (session?.role !== Role.REGISTRY) {
        // Or handle appropriately if metadata generation should fail differently
        return { title: 'Access Denied' };
    }
    const center = await prisma.center.findUnique({
        where: { id: params.centerId },
        select: { name: true },
    });
    return {
        title: `View Claims - ${center?.name || 'Center'}`,
        description: `View claims submitted to the ${center?.name || 'selected'} center.`,
    };
}

// The main Registry Center Claims List Page component (Server Component)
export default async function RegistryCenterClaimsPage({ params, searchParams }: RegistryCenterClaimsPageProps) {
    const { centerId } = params;
    const session = getCurrentUserSession();

    // --- Authorization ---
    if (!session) redirect('/login');
    // ** Crucial Check: Only REGISTRY role allowed **
    if (session.role !== Role.REGISTRY) {
         console.warn(`RegistryCenterClaimsPage: Non-registry user (Role: ${session.role}) attempting access.`);
         redirect('/dashboard');
    }

    // Verify the center exists
    const center = await prisma.center.findUnique({
        where: { id: centerId },
        select: { name: true }
    });

    if (!center) {
        console.warn(`RegistryCenterClaimsPage: Center ${centerId} not found.`);
        notFound();
    }

    // --- Search Logic ---
    const searchQuery = searchParams?.query || ''; // Get search query from URL
    console.log(`[Registry Page] Current Search Query: "${searchQuery}" for Center ${centerId}`);

    // --- Data Fetching ---
    const whereClause: Prisma.ClaimWhereInput = {
        centerId: centerId, // Filter by the specific center
        // Apply search filter if query exists
        ...(searchQuery && {
            OR: [
                // Search relevant fields (case-insensitive handled by DB default or remove 'mode')
                { id: { contains: searchQuery } },
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
            )
        }),
    };

    // Ensure the OR array is not empty after filtering, otherwise Prisma might error
    if (whereClause.OR && whereClause.OR.length === 0 && searchQuery) {
        // If the search query didn't match any valid enum and no other fields were searched,
        // it means no results are possible for this specific query.
        // Set OR to an impossible condition to return zero results.
        whereClause.OR = [{ id: { equals: 'impossible_id_to_prevent_error' } }];
    } else if (whereClause.OR && whereClause.OR.length === 0 && !searchQuery) {
         // If OR is empty but there was no search query, remove the empty OR clause
         delete whereClause.OR;
    }


    let claims: ClaimForCoordinatorView[] = []; // Reuse the type for now
    try {
        claims = await prisma.claim.findMany({
            where: whereClause,
            select: { // Select fields needed for the table
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
                 { status: 'asc' },
                 { submittedAt: 'desc' }
            ]
            // Add pagination logic here if needed
        });
        console.log(`RegistryCenterClaimsPage: Displaying ${claims.length} claims for center ${center.name} matching query "${searchQuery}"`);

    } catch (error) {
        console.error("RegistryCenterClaimsPage: Error fetching claims:", error);
        // Handle error display appropriately (e.g., show an error message)
    }

    return (
        <div className="space-y-6">
             {/* Back Button */}
             <Button variant="outline" size="sm" asChild>
                <Link href={`/registry/centers`}> {/* Link back to centers list */}
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Centers List
                </Link>
            </Button>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <FileText className="mr-3 h-7 w-7 text-primary" />
                        View Claims
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">
                        Center: <span className="font-semibold">{center.name}</span>
                    </p>
                </div>
                 {/* Add other header elements if needed */}
            </div>

             {/* Search Input Component */}
            <div className="flex justify-start pt-2 pb-4">
                 <ClaimSearchInput initialQuery={searchQuery} />
            </div>

            {/* Claims Data Display */}
            {claims.length > 0 ? (
                 // Pass 'REGISTRY' role to potentially hide actions in the table
                 // Ensure ClaimsTable component handles the userRole prop correctly
                 <ClaimsTable
                    centerId={centerId}
                    claims={claims}
                    currentUserId={session.userId} // Pass Registry user ID
                    userRole={session.role} // Explicitly pass the role
                 />
            ) : (
                // Display message when no claims match the search/filter
                <Card className="mt-4 border-dashed">
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p className="font-medium">
                                {searchQuery ? `No claims found matching "${searchQuery}".` : `No claims found for ${center.name}.`}
                            </p>
                            {searchQuery && (
                                <Button variant="link" asChild className="mt-2 text-primary">
                                    <Link href={`/registry/centers/${centerId}/claims`}>Clear Search</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
