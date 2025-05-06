// app/(protected)/coordinator/[centerId]/departments/[departmentId]/page.tsx

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
// Assuming UserSession is the correct type returned by getCurrentUserSession
import { getCurrentUserSession, UserSession } from '@/lib/auth';
import { Role, Department, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Building2, Users, Terminal } from 'lucide-react';
import React from 'react'; // Import React

// *** Updated to use type definition instead of interface ***
type PageParams = {
    centerId: string;
    departmentId: string;
};

// Define the type for the fetched data, including lecturers
type DepartmentWithLecturers = Department & {
    lecturers: Pick<User, 'id' | 'name' | 'email'>[]; // Select specific lecturer fields
    center: { // Include center for validation
        coordinatorId: string;
        name: string;
    } | null;
};

// Function to generate dynamic metadata
export async function generateMetadata(
    { params }: { params: PageParams }
): Promise<Metadata> {
    // Use synchronous function based on lib/auth.ts
    const session = getCurrentUserSession();
    // Basic auth check for metadata
    if (session?.role !== Role.COORDINATOR) {
        return { title: "Access Denied" };
    }

    try {
        const department = await prisma.department.findFirst({
            where: {
                id: params.departmentId,
                centerId: params.centerId,
                center: {
                    coordinatorId: session.userId, // Ensure coordinator owns the center
                },
            },
            select: { name: true, center: { select: { name: true } } },
        });

        return {
            title: department ? `Department: ${department.name}` : 'Department Details',
            description: `Details and assigned lecturers for department ${department?.name || params.departmentId} in center ${department?.center?.name || params.centerId}.`,
        };
    } catch (error) {
        console.error("Error generating metadata for department page:", error);
        return {
            title: "Error Loading Department",
            description: "Could not load department details.",
        };
    }
}

// The main Department Detail Page component (Server Component)
// *** Updated to use Next.js App Router expected parameter structure ***
export default async function DepartmentDetailPage({
    params,
    searchParams,
}: {
    params: PageParams;
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { centerId, departmentId } = params; // Destructure params
    // Use synchronous function based on lib/auth.ts
    const session = getCurrentUserSession();

    // --- Authorization Check ---
    if (!session) redirect('/login');
    if (session.role !== Role.COORDINATOR) redirect('/dashboard');

    let department: DepartmentWithLecturers | null = null;
    let errorFetching: string | null = null;

    try {
        department = await prisma.department.findUnique({
            where: {
                id: departmentId,
                // Ensure the department belongs to the center specified in the URL
                centerId: centerId,
            },
            include: {
                lecturers: { // Include lecturers assigned to this department
                    where: { role: Role.LECTURER }, // Ensure only lecturers are included
                    select: { id: true, name: true, email: true },
                    orderBy: { name: 'asc' }, // Order lecturers by name
                },
                center: { // Include center to verify coordinator ownership
                    select: { coordinatorId: true, name: true }
                }
            },
        });

        // Further validation: Check if center exists and if coordinator owns it
        if (!department || !department.center || department.center.coordinatorId !== session.userId) {
            console.warn(`DepartmentDetailPage: Coordinator ${session.userId} failed access check for department ${departmentId} in center ${centerId}.`);
            notFound(); // Department not found, doesn't belong to center, or coordinator doesn't own center
        }

    } catch (error) {
        console.error("DepartmentDetailPage: Error fetching department data:", error);
        errorFetching = "Could not load department details due to an error.";
        // Fall through to render error message
    }

    // Handle case where department wasn't found after try/catch (redundant if notFound() is hit, but safe)
    if (!department && !errorFetching) {
        notFound();
    }

    // --- Render Page ---
    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="outline" size="sm" asChild>
                <Link href={`/coordinator/${centerId}/departments`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments List
                </Link>
            </Button>

            {/* Display Error if Fetching Failed */}
            {errorFetching && (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorFetching}</AlertDescription>
                </Alert>
            )}

            {/* Department Details Card */}
            {department && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Building2 className="h-6 w-6 text-primary" />
                            Department: {department.name}
                        </CardTitle>
                        <CardDescription>
                            Center: {department.center?.name || 'N/A'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            Assigned Lecturers ({department.lecturers.length})
                        </h3>
                        {department.lecturers.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            {/* Add Actions column if needed later */}
                                            {/* <TableHead className="text-right">Actions</TableHead> */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {department.lecturers.map((lecturer) => (
                                            <TableRow key={lecturer.id}>
                                                <TableCell className="font-medium">{lecturer.name || 'N/A'}</TableCell>
                                                <TableCell>{lecturer.email}</TableCell>
                                                {/* Actions Cell Example (e.g., Unassign) */}
                                                {/* <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" disabled>Unassign (TBD)</Button>
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No lecturers currently assigned to this department.</p>
                        )}
                    </CardContent>
                     {/* Optional Footer for actions related to the department itself */}
                     {/* <CardFooter> ... </CardFooter> */}
                </Card>
            )}
        </div>
    );
}

