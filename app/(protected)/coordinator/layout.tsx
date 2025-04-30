import React from 'react';
import { redirect } from 'next/navigation'; // For server-side redirects
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role } from '@prisma/client'; // Import Role enum

// Layout for the main /coordinator route and potentially nested routes.
// Its primary function currently is to perform an authorization check.
export default async function CoordinatorLayout({
  children, // Represents the specific page component being rendered (e.g., CoordinatorLandingPage)
}: {
  children: React.ReactNode; // Type definition for children prop
}) {
  // --- Authorization Check ---
  // Fetch the current user session on the server.
  const session = getCurrentUserSession();

  // Verify the user has the COORDINATOR role.
  // NOTE: We also allow REGISTRY here just in case an admin needs to access coordinator views in the future.
  // Adjust this condition if Registry should *not* have access to /coordinator/* routes.
  if (session?.role !== Role.COORDINATOR && session?.role !== Role.REGISTRY) {
    console.warn(`CoordinatorLayout: Unauthorized access attempt by user with role ${session?.role}. Redirecting.`);
    // Redirect non-coordinators/non-registry users to the main dashboard.
    redirect('/dashboard');
  }

  // If the user is authorized (Coordinator or Registry), render the requested child page.
  // Specific navigation for coordinators (like managing claims, departments for their center)
  // is handled within the nested layout for their specific center:
  // app/(protected)/coordinator/[centerId]/layout.tsx
  return (
    <div>
      {/* Render the specific page content */}
      {children}
    </div>
  );
}
