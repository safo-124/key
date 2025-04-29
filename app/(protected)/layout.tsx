"use client"; // Needs to be client component for hooks (useRouter) and onClick handler

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use router for navigation
import Link from 'next/link';
import { LogOut, Menu, Package2 } from 'lucide-react'; // Icons
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/lib/actions/auth.actions'; // Import the logout action
import { toast } from 'sonner';
import { getCurrentUserSession, UserSession } from '@/lib/auth'; // Import helper to potentially get session client-side (or use server props)
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile nav

// The main layout for authenticated users
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Note: Client-side session fetching is generally discouraged for initial render/auth checks.
  // Middleware handles the primary protection. This could be used for displaying user info if needed.
  // const [session, setSession] = useState<UserSession>(null);
  // useEffect(() => {
  //   // Example: Fetch session client-side if needed, but middleware is preferred for protection
  //   // const fetchSession = async () => { ... }; fetchSession();
  // }, []);

  // Handle logout action
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        toast.success("Logged out successfully.");
        // Redirect to login page after logout
        router.push('/login');
      } else {
        toast.error(result.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main Header */}
      <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 z-50"> {/* Ensure header is above content */}
        {/* Logo and Desktop Navigation */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard" // Link logo/title to the main dashboard
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" /> {/* Simple Logo Icon */}
            <span className="sr-only">Claims App</span> {/* Screen reader text */}
             Claims App {/* Visible Title */}
          </Link>
          {/* Add other top-level navigation links for all users if needed */}
          {/* Example:
           <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
             Dashboard
           </Link>
          */}
        </nav>

        {/* Mobile Navigation (Sheet) */}
        <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden" // Only show on mobile
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="">Claims App</span>
                </Link>
                {/* Add mobile navigation links here - these might mirror sidebar links */}
                 <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                 </Link>
                 <Link href="/registry" className="text-muted-foreground hover:text-foreground">
                    Registry Area
                 </Link>
                 {/* Add links for Coordinator/Lecturer based on role if needed */}
                </nav>
            </SheetContent>
        </Sheet>


        {/* Header Right Side */}
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
           {/* Optional: Add search bar or other header elements here */}
           <div className="ml-auto flex-1 sm:flex-initial">
             {/* Example: <Search /> component */}
           </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout} // Call handleLogout on click
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>

           {/* Optional: User profile dropdown */}
           {/* <DropdownMenu> ... </DropdownMenu> */}
        </div>
      </header>

      {/* Main Content Area where nested layouts/pages render */}
      {/* The RegistryLayout or other role-specific layouts will render inside this 'children' */}
      <div className="flex-1"> {/* Ensure content area takes remaining height */}
        {children}
      </div>

      {/* Optional Footer */}
      {/* <footer className="border-t p-4 text-center text-sm text-muted-foreground">
         © {new Date().getFullYear()} Claims Management App
      </footer> */}
    </div>
  );
}
