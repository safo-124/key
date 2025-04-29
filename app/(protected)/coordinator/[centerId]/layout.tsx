"use client"; // Needed for usePathname in NavLink

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation'; // Import useParams
import { cn } from '@/lib/utils';
import { getCurrentUserSession } from '@/lib/auth'; // We need a way to get session client-side OR pass it down
import { Role } from '@prisma/client';
import { LayoutDashboard, FileText, Building2, Users, ArrowLeft } from 'lucide-react'; // Icons
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Helper component for navigation links within this layout
function CoordinatorNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current full path
  const isActive = pathname === href; // Exact match for active state

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary font-semibold" // Active styles
      )}
    >
      {children}
    </Link>
  );
}

// Layout for managing a specific center
export default function CoordinatorCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams(); // Get URL parameters (including centerId)
  const router = useRouter();
  const centerId = params.centerId as string; // Extract centerId

  // State for loading and validation - validation ideally happens server-side first,
  // but client-side checks can enhance UX or handle edge cases.
  // A better approach might involve fetching data in a server component parent and passing it down.
  // For simplicity here, we'll assume middleware/page-level checks handle primary auth.
  const [isLoading, setIsLoading] = useState(true);
  const [centerName, setCenterName] = useState<string | null>(null);
  const [isValidAccess, setIsValidAccess] = useState(false); // Placeholder for access validation

  // --- Authentication/Authorization Note ---
  // Ideally, the parent layout or middleware already confirmed the user is a Coordinator.
  // A robust check here would involve:
  // 1. Getting the current user's ID (e.g., from a client-side session context or passed props).
  // 2. Fetching the center data (server-side preferably) to verify:
  //    a) The center with `centerId` exists.
  //    b) The fetched center's `coordinatorId` matches the current user's ID.
  // If validation fails, redirect.

  // Simulate fetching center name and validating access (replace with actual logic if needed)
  useEffect(() => {
    const validateAndFetch = async () => {
        setIsLoading(true);
        // --- Placeholder: Replace with actual fetch/validation ---
        // Example: const data = await fetch(`/api/centers/${centerId}/details`);
        // if (data.ok) {
        //    const centerData = await data.json();
        //    // Check if centerData.coordinatorId matches logged-in user ID
        //    setCenterName(centerData.name);
        //    setIsValidAccess(true); // Assuming validation passes
        // } else {
        //    setIsValidAccess(false);
        //    router.push('/dashboard'); // Redirect if invalid access
        // }
        // Simulate fetch delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setCenterName(`Center ${centerId.substring(0, 6)}...`); // Placeholder name
        setIsValidAccess(true); // Assume valid for now
        // --- End Placeholder ---
        setIsLoading(false);
    };

    if (centerId) {
        validateAndFetch();
    } else {
        // Handle case where centerId is missing (shouldn't happen with correct routing)
        setIsValidAccess(false);
        router.push('/dashboard');
    }
  }, [centerId, router]);

  if (isLoading) {
    // Show loading skeletons while validating/fetching
    return (
      <div className="p-4 lg:p-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isValidAccess) {
    // Render nothing or an error message while redirecting
    return null;
  }

  // Base paths for navigation links within this center
  const basePath = `/coordinator/${centerId}`;

  return (
    <div className="space-y-6">
       {/* Optional: Back link or Breadcrumbs */}
       {/* <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
       </Link> */}

       <h1 className="text-3xl font-bold">Manage Center: {centerName || 'Loading...'}</h1>

       {/* Navigation Tabs/Links for this Center */}
       <nav className="flex space-x-2 lg:space-x-4 border-b">
            <CoordinatorNavLink href={`${basePath}`}>
                <LayoutDashboard className="h-4 w-4 mr-1" /> Overview
            </CoordinatorNavLink>
             <CoordinatorNavLink href={`${basePath}/claims`}>
                <FileText className="h-4 w-4 mr-1" /> Claims
            </CoordinatorNavLink>
             <CoordinatorNavLink href={`${basePath}/departments`}>
                <Building2 className="h-4 w-4 mr-1" /> Departments
            </CoordinatorNavLink>
             <CoordinatorNavLink href={`${basePath}/lecturers`}>
                <Users className="h-4 w-4 mr-1" /> Lecturers
            </CoordinatorNavLink>
       </nav>

      {/* Render the specific page content for this center */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
