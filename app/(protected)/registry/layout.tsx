"use client"; // Directive needed because RegistryNavLink uses usePathname

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path
import { cn } from '@/lib/utils'; // Utility for conditional classes
import { Building, Users } from 'lucide-react'; // Icons

// Component for individual navigation links
// This component uses usePathname, necessitating the "use client" directive in the parent layout
function RegistryNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current URL path
  // Check if the current path starts with the link's href for active state
  // Handles nested routes (e.g., /registry/centers/create should highlight /registry/centers)
  const isActive = pathname === href || (href !== '/registry' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary font-semibold" // Apply active styles
      )}
    >
      {children}
    </Link>
  );
}

// The layout component for the Registry section
export default function RegistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Responsive grid layout: sidebar + main content
    // Sidebar hidden on small screens (md:block)
    <div className="grid min-h-[calc(100vh-3.5rem)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

      {/* Sidebar Navigation for Registry */}
      <div className="hidden border-r bg-muted/40 md:block">
        {/* Sticky sidebar container */}
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-[3.5rem]"> {/* Adjust top value based on your main header height */}
          {/* Sidebar Header */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/registry" className="flex items-center gap-2 font-semibold">
              {/* <Package2 className="h-6 w-6" /> */} {/* Optional Logo Placeholder */}
              <span className="">Registry Menu</span>
            </Link>
            {/* Optional: Add a notification/alert icon here if needed */}
          </div>
          {/* Navigation Links Area */}
          <div className="flex-1 overflow-auto py-2"> {/* Allow scrolling if links overflow */}
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* Navigation Links using the client component */}
               <RegistryNavLink href="/registry"> {/* Link to the registry dashboard */}
                 {/* Consider adding a dashboard icon e.g., <Home className="h-4 w-4" /> */}
                 Dashboard
              </RegistryNavLink>
              <RegistryNavLink href="/registry/centers">
                <Building className="h-4 w-4" />
                Centers
              </RegistryNavLink>
              <RegistryNavLink href="/registry/users">
                <Users className="h-4 w-4" />
                Users
              </RegistryNavLink>
              {/* Add more registry-specific links here as needed */}
              {/* Example:
              <RegistryNavLink href="/registry/settings">
                <Settings className="h-4 w-4" />
                Settings (TBD)
              </RegistryNavLink> */}
            </nav>
          </div>
           {/* Optional: Add content at the bottom of the sidebar */}
           {/* <div className="mt-auto p-4"> ... </div> */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
         {/*
           Optional: Mobile Header for Navigation (if sidebar is hidden)
           You might add a Sheet component trigger here for mobile nav using Shadcn UI Sheet
         */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* Render the actual page content (e.g., Registry Dashboard, Centers List) */}
          {children}
        </main>
      </div>
    </div>
  );
}
