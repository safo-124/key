import React from 'react';
import { redirect } from 'next/navigation'; // For server-side redirects
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role } from '@prisma/client'; // Import Role enum

// Layout for the main /lecturer route and potentially nested routes.
// It mainly performs an authorization check.
export default async function LecturerLayout({
  children, // The specific page component being rendered (e.g., LecturerLandingPage)
}: {
  children: React.ReactNode;
}) {
  // --- Authorization Check ---
  // Fetch the current user session on the server.
  const session = getCurrentUserSession();

  // Verify the user has the LECTURER role.
  // If not, redirect them to a more appropriate dashboard.
  if (session?.role !== Role.LECTURER) {
    console.warn(`LecturerLayout: Non-lecturer user (Role: ${session?.role}) attempting access.`);
    // Redirect based on actual role or to a generic dashboard
    if (session?.role === Role.REGISTRY) {
      redirect('/registry');
    } else if (session?.role === Role.COORDINATOR) {
      // Redirect coordinator to their landing page which handles center redirection
      redirect('/coordinator');
    } else {
      // Redirect any other case (including unauthenticated, though middleware should catch that)
      redirect('/dashboard');
    }
  }

  // If the user is a Lecturer, render the requested child page.
  // Specific navigation for lecturers (like viewing claims, creating claims)
  // will typically be handled within the nested layout for their specific center
  // (e.g., app/(protected)/lecturer/[centerId]/layout.tsx).
  return (
    <div>
      {/* Render the specific page content */}
      {children}
    </div>
  );
}
