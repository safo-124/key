"use client"; // Mark as Client Component due to usage of hooks like usePathname, useParams, useState, useEffect

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation'; // Import necessary hooks
import { cn } from '@/lib/utils'; // Utility for conditional class names
// Note: Accessing session directly client-side is complex. Authentication should primarily rely on middleware/server checks.
// import { getCurrentUserSession } from '@/lib/auth'; // Avoid direct client-side use for auth checks usually
import { Role } from '@prisma/client'; // Import Role enum if needed for client-side logic (less common)
import { LayoutDashboard, FileText, Building2, Users, ArrowLeft, Loader2 } from 'lucide-react'; // Icons
import { Skeleton } from '@/components/ui/skeleton'; // For loading state feedback
import { Button } from '@/components/ui/button'; // Button component
// Removed toast import

// Helper component for rendering navigation links within this layout
// It uses usePathname to determine the active link
function CoordinatorNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current full URL path
  // Determine if the link is active by checking if the current path exactly matches the link's href
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn( // Apply styles conditionally
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary", // Base and hover styles
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" // Active styles
      )}
      aria-current={isActive ? 'page' : undefined} // Accessibility attribute for active link
    >
      {children}
    </Link>
  );
}

// The main layout component for managing a specific center as a Coordinator
export default function CoordinatorCenterLayout({
  children, // Represents the actual page content being rendered (e.g., Overview, Claims list)
}: {
  children: React.ReactNode;
}) {
  const params = useParams(); // Hook to get dynamic route parameters from the URL
  const router = useRouter(); // Hook for programmatic navigation
  const centerId = params.centerId as string; // Extract centerId, assert as string

  // --- State Management ---
  // State to track if initial data/validation is loading
  const [isLoading, setIsLoading] = useState(true);
  // State to store the fetched center name (optional, could be fetched in page)
  const [centerName, setCenterName] = useState<string | null>(null);
  // State to track if the current user has valid access to this center
  const [isValidAccess, setIsValidAccess] = useState(false); // Default to false

  // --- Authentication & Data Fetching Effect ---
  // This useEffect handles client-side validation and fetching initial data like center name.
  // NOTE: Critical authorization (is user a coordinator? do they own this center?)
  // SHOULD primarily happen on the SERVER (in middleware or the Page component's RSC logic)
  // for security. This client-side check is more for UX or secondary validation.
  useEffect(() => {
    const validateAndFetch = async () => {
        setIsLoading(true); // Start loading

        // --- Placeholder for actual validation/fetch logic ---
        // In a real app, you might:
        // 1. Get user session info (e.g., from context or a client-side fetch).
        // 2. Make an API call or use a Server Action to:
        //    - Fetch center details (`/api/centers/${centerId}/verifyAccess`).
        //    - Verify if the center exists and if the current user is its coordinator.
        //    - Return the center name if access is valid.

        try {
            // Simulate API call / validation delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // ** Replace with actual logic **
            // Example: Assume validation passes and fetch center name (replace with real fetch)
            const fetchedName = `Center ${centerId.substring(0, 6)}...`; // Placeholder
            const accessGranted = true; // Assume access is granted for this example

            if (accessGranted) {
                setCenterName(fetchedName);
                setIsValidAccess(true);
            } else {
                // If access denied by server/API
                setIsValidAccess(false);
                console.error(`Access Denied: User does not coordinate center ${centerId}.`); // Log error instead of toast
                router.push('/dashboard'); // Redirect if invalid access
            }
        } catch (error) {
             console.error("Error validating center access:", error);
             // Removed toast.error("Error verifying access to center.");
             setIsValidAccess(false);
             router.push('/dashboard'); // Redirect on error
        } finally {
            setIsLoading(false); // Stop loading
        }
        // --- End Placeholder ---
    };

    // Only run validation if centerId is present in the URL
    if (centerId) {
        validateAndFetch();
    } else {
        // If centerId is missing (should not happen with proper routing), redirect
        console.error("CoordinatorCenterLayout: centerId is missing from params.");
        setIsValidAccess(false);
        router.push('/dashboard');
        setIsLoading(false);
    }
    // Run effect when centerId changes (relevant if navigating between centers client-side)
  }, [centerId, router]);

  // --- Loading State ---
  // Display skeletons or a loading indicator while validating access/fetching initial data
  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        {/* Skeleton for Title */}
        <Skeleton className="h-8 w-1/2 mb-4" />
        {/* Skeleton for Navigation */}
        <div className="flex space-x-4 border-b pb-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
        </div>
        {/* Skeleton for Page Content */}
        <div className="mt-4 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // --- Invalid Access State ---
  // If validation failed, render nothing (or an error message) while redirecting
  if (!isValidAccess) {
    // The redirect should have already been initiated in useEffect
    return null;
  }

  // --- Render Layout ---
  // Define the base path for navigation links within this specific center
  const basePath = `/coordinator/${centerId}`;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6"> {/* Add padding and spacing */}
       {/* Optional: Breadcrumbs or Back Link */}
       {/*
       <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main Dashboard
            </Link>
       </Button>
       */}

       {/* Center Title */}
       <h1 className="text-2xl md:text-3xl font-bold">
           Manage Center: {centerName || 'Loading...'}
        </h1>

       {/* Navigation Tabs/Links specific to this Center */}
       <nav className="flex flex-wrap gap-2 border-b pb-2"> {/* Use flex-wrap for smaller screens */}
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
            {/* Add more center-specific navigation links if needed */}
       </nav>

      {/* Render the specific page content (child component) */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
