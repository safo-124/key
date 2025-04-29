import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth';
import { Role } from '@prisma/client';

// Layout for the main /coordinator route and potentially nested routes.
export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Role check: Ensure the user is a Coordinator or Registry (Registry might need access for overview)
  // Adjust this logic based on whether Registry should access coordinator views.
  const session = getCurrentUserSession();
  if (session?.role !== Role.COORDINATOR && session?.role !== Role.REGISTRY) {
    console.warn("CoordinatorLayout: Non-coordinator/registry user attempting access.");
    redirect('/dashboard'); // Or redirect to an unauthorized page
  }

  // For now, this layout just renders the children.
  // Specific coordinator navigation might be added here or in a nested layout later.
  return (
    <div>
      {/* Render the specific page content (e.g., Coordinator Dashboard or Center View) */}
      {children}
    </div>
  );
}
