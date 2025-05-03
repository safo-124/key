// app/(protected)/registry/centers/[centerId]/claims/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus, Prisma, Claim, User, ThesisType, ClaimType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileText, Search, ArrowLeft, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ClaimSearchInput } from '@/components/claims/ClaimSearchInput';
import { ClaimsTable } from '@/components/tables/ClaimsTable';
import { ClaimForCoordinatorView } from '@/app/(protected)/coordinator/[centerId]/claims/page';

type RegistryCenterClaimsPageProps = {
    params: {
        centerId: string;
    };
    searchParams?: {
        query?: string;
        page?: string;
    };
};

export async function generateMetadata({ params }: RegistryCenterClaimsPageProps): Promise<Metadata> {
    const session = getCurrentUserSession();
    if (session?.role !== Role.REGISTRY) {
        return { title: 'Access Denied' };
    }
    const center = await prisma.center.findUnique({
        where: { id: params.centerId },
        select: { name: true },
    });
    return {
        title: `${center?.name || 'Center'} Claims`,
        description: `View and manage claims for ${center?.name || 'selected'} center.`,
    };
}

export default async function RegistryCenterClaimsPage({ params, searchParams }: RegistryCenterClaimsPageProps) {
    const { centerId } = params;
    const session = await getCurrentUserSession();

    // Authorization
    if (!session) redirect('/login');
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

    // Search Logic
    const searchQuery = searchParams?.query || '';
    console.log(`[Registry Page] Current Search Query: "${searchQuery}" for Center ${centerId}`);

    // Data Fetching
    const whereClause: Prisma.ClaimWhereInput = {
        centerId: centerId,
        ...(searchQuery && {
            OR: [
                { id: { contains: searchQuery } },
                { submittedBy: { name: { contains: searchQuery } } },
                { submittedBy: { email: { contains: searchQuery } } },
                { claimType: { equals: Object.values(ClaimType).find(val => val.toLowerCase() === searchQuery.toLowerCase()) } },
                { transportDestinationTo: { contains: searchQuery } },
                { transportDestinationFrom: { contains: searchQuery } },
                { thesisExamCourseCode: { contains: searchQuery } },
                { status: { equals: Object.values(ClaimStatus).find(val => val.toLowerCase() === searchQuery.toLowerCase()) } },
            ].filter(condition => 
                (condition.claimType && condition.claimType.equals !== undefined) ||
                (condition.status && condition.status.equals !== undefined) ||
                (condition.id || condition.submittedBy || condition.transportDestinationTo || condition.transportDestinationFrom || condition.thesisExamCourseCode)
            )
        }),
    };

    if (whereClause.OR && whereClause.OR.length === 0 && searchQuery) {
        whereClause.OR = [{ id: { equals: 'impossible_id_to_prevent_error' } }];
    } else if (whereClause.OR && whereClause.OR.length === 0 && !searchQuery) {
        delete whereClause.OR;
    }

    let claims: ClaimForCoordinatorView[] = [];
    try {
        claims = await prisma.claim.findMany({
            where: whereClause,
            select: {
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
        });
        console.log(`RegistryCenterClaimsPage: Displaying ${claims.length} claims for center ${center.name} matching query "${searchQuery}"`);
    } catch (error) {
        console.error("RegistryCenterClaimsPage: Error fetching claims:", error);
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <Button variant="outline" size="sm" asChild className="w-fit">
                    <Link href="/registry/centers">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Centers
                    </Link>
                </Button>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Claims Management</h1>
                            <p className="text-sm text-gray-500">
                                Center: <span className="font-medium text-gray-700">{center.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-96">
                            <ClaimSearchInput initialQuery={searchQuery} />
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {claims.length} claim{claims.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Claims Table */}
            {claims.length > 0 ? (
                <Card className="border-0 shadow-sm overflow-hidden">
                    <ClaimsTable
                        centerId={centerId}
                        claims={claims}
                        currentUserId={session.userId}
                        userRole={session.role}
                    />
                </Card>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center justify-center text-center gap-4">
                            <Search className="h-10 w-10 text-gray-300" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {searchQuery ? 'No matching claims found' : 'No claims available'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {searchQuery 
                                        ? `No claims match your search for "${searchQuery}"`
                                        : `This center currently has no submitted claims`}
                                </p>
                            </div>
                            {searchQuery && (
                                <Button variant="outline" asChild>
                                    <Link href={`/registry/centers/${centerId}/claims`}>
                                        Clear search
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}