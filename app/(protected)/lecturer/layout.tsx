import React from 'react';
import { redirect } from 'next/navigation'; // For server-side redirects
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role } from '@prisma/client'; // Import Role enum

// Layout for the main /lecturer route and potentially nested routes.
// Its primary function currently is to perform an authorization check.
export default async function LecturerLayout({
  children, // Represents the specific page component being rendered (e.g., LecturerLandingPage)
}: {
  children: React.ReactNode; // Type definition for children prop
}) {
  // --- Authorization Check ---
  // Fetch the current user session on the server.
  const session = getCurrentUserSession();

  // Verify the user has the LECTURER role.
  // If not, redirect them to a more appropriate dashboard based on their actual role.
  if (session?.role !== Role.LECTURER) {
    console.warn(`LecturerLayout: Non-lecturer user (Role: ${session?.role}) attempting access. Redirecting.`);
    // Redirect based on actual role or to a generic dashboard
    if (session?.role === Role.REGISTRY) {
      redirect('/registry'); // Redirect Registry admins to their section
    } else if (session?.role === Role.COORDINATOR) {
      // Redirect coordinators to their landing page, which handles further redirection to their center
      redirect('/coordinator');
    } else {
      // Redirect any other case (including potentially unauthenticated users,
      // although middleware should ideally handle that case earlier) to the main dashboard.
      redirect('/dashboard');
    }
  }

  // If the user is authorized (is a Lecturer), render the requested child page component.
  // Note: Specific navigation links for lecturers (e.g., "My Claims", "Submit Claim")
  // are typically better placed within the layout for their specific center context
  // (e.g., app/(protected)/lecturer/[centerId]/layout.tsx), as those actions
  // are usually tied to the center they are assigned to.
  return (
    <div>
      {/* Render the specific page content passed as children */}
      {children}
    </div>
  );
}
