// app/(protected)/lecturer/[centerId]/layout.tsx
"use server";

import * as React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { LayoutDashboard, FileText, FilePlus, Building2 } from 'lucide-react';
import { LecturerNavLink } from '@/components/nav/LecturerNavLink';

type LecturerLayoutProps = {
    children: React.ReactNode;
    params: {
        centerId: string;
    };
};

export default async function LecturerCenterLayout({ children, params }: LecturerLayoutProps) {
    const { centerId } = params;
    const session = await getCurrentUserSession();

    // Authorization Check
    if (!session) redirect('/login');
    if (session.role !== Role.LECTURER) redirect('/dashboard');

    // Verify Lecturer Center Assignment
    let centerName = 'Center';
    try {
        const lecturerAssignment = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { 
                lecturerCenterId: true, 
                lecturerCenter: { select: { name: true } } 
            }
        });

        if (!lecturerAssignment?.lecturerCenterId) {
            redirect('/dashboard?error=no_center_assignment');
        } else if (lecturerAssignment.lecturerCenterId !== centerId) {
            redirect(`/lecturer/${lecturerAssignment.lecturerCenterId}`);
        } else {
            centerName = lecturerAssignment.lecturerCenter?.name || centerName;
        }
    } catch (error) {
        console.error("LecturerCenterLayout error:", error);
        redirect('/dashboard?error=auth_check_failed');
    }

    const basePath = `/lecturer/${centerId}`;

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] bg-white">
            {/* Sidebar with Red to Blue Gradient */}
            <aside className="hidden border-r border-gray-200 md:block bg-gradient-to-b from-red-500 via-purple-600 to-blue-600">
                <div className="fixed h-full w-[240px] flex flex-col">
                    {/* Sidebar Header with subtle transparency */}
                    <div className="flex h-16 items-center border-b border-white/20 px-6 bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 font-semibold text-white">
                            <Building2 className="h-5 w-5" />
                            <span className="truncate max-w-[160px]" title={centerName}>
                                {centerName}
                            </span>
                        </div>
                    </div>

                    {/* Navigation with hover effects */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        <ul className="space-y-1">
                            <LecturerNavLink 
                                href={basePath}
                                icon={<LayoutDashboard className="h-4 w-4" />}
                              
                            >
                                Dashboard
                            </LecturerNavLink>
                            <LecturerNavLink 
                                href={`${basePath}/claims`}
                                icon={<FileText className="h-4 w-4" />}
                              
                            >
                                My Claims
                            </LecturerNavLink>
                            <LecturerNavLink 
                                href={`${basePath}/claims/create`}
                                icon={<FilePlus className="h-4 w-4" />}
                                
                            >
                                New Claim
                            </LecturerNavLink>
                        </ul>
                    </nav>

                    {/* Footer Section with subtle transparency */}
                    <div className="border-t border-white/20 p-4 bg-white/10 backdrop-blur-sm">
                        <div className="text-sm text-white/80">
                            Lecturer Portal
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-col">
                <div className="flex-1 p-4 md:p-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}