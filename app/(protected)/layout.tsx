"use client"; // Needs to be client component for hooks and event handlers

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// Removed Menu icon as mobile nav is removed
import { LogOut, Home, Building, Users as UsersIcon, User as UserAvatarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/lib/actions/auth.actions'; // Ensure this path is correct
// Removed Sheet components
// import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator"; // Keep if used elsewhere, maybe in dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// --- Path to your UEW logo inside the 'public' folder ---
const uewLogoPath = "/image.png"; // Using the filename "image.png"

// --- Helper Function Placeholder (Keep as is) ---
async function fetchUserNameClientSide(): Promise<string | null> {
    console.log("Attempting to fetch user name client-side (placeholder)...");
    await new Promise(resolve => setTimeout(resolve, 400));
     try {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce((acc, current) => {
            const [name, ...value] = current.split('=');
            acc[name] = value.join('=');
            return acc;
        }, {} as Record<string, string>);
        const sessionCookie = cookies['app_session']; // Use your actual cookie name
        if (sessionCookie) {
            const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
            if (sessionData?.name) {
                 console.log("Fetched name from cookie:", sessionData.name);
                 return sessionData.name;
            }
        }
    } catch (error) {
        console.error("Error reading session cookie for name:", error);
    }
    console.log("Could not fetch/find user name.");
    return null;
}


// The main layout for authenticated users - Blue Theme - Desktop Only Nav
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("?");
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Fetch user name when component mounts using the API route
  useEffect(() => {
    let isMounted = true;
    setIsSessionLoading(true);

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me'); // Call the API route

        if (!isMounted) return;

        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name || null);

          if (userData.name) {
            const nameParts = userData.name.split(' ');
            const initials = nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                : nameParts[0]?.[0] || 'U';
            setUserInitials(initials.toUpperCase());
          } else {
             // Fallback to email initial if name is not available
             const emailInitial = userData.email?.[0]?.toUpperCase() || 'U';
             setUserInitials(emailInitial);
          }
        } else {
          console.error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
          // If unauthorized, redirect to login
          if (response.status === 401 || response.status === 403) {
             router.push('/login');
          }
          setUserName(null);
          setUserInitials("!");
        }
      } catch (error) {
        console.error("Error fetching user data from /api/user/me:", error);
        if (isMounted) {
            setUserName(null);
            setUserInitials("!");
        }
      } finally {
        if (isMounted) {
            setIsSessionLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function to prevent state updates on unmounted component
    return () => { isMounted = false; };
  }, [router]); // Dependency array includes router


  // Handle logout action
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        console.log("Logged out successfully.");
        // Reset state and redirect
        setUserName(null); setUserInitials("?"); setIsSessionLoading(true);
        router.push('/login');
      } else {
        console.error("Logout failed:", result.message);
        // Use toast or alert for user feedback if available
        // toast.error(result.message || "Logout failed.");
        alert(result.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // toast.error("An unexpected error occurred during logout.");
      alert("An unexpected error occurred during logout.");
    }
  };

  // Define navigation links (no longer needed for mobile sheet)
  // const navLinks = [ ... ];

  return (
    // Use a light background for the overall page container
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-blue-50 via-white to-white">

      {/* Main Header - Blue Gradient Background */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 px-4 md:px-6 z-50 shadow-lg text-white">

        {/* Logo and Desktop Navigation */}
        {/* Removed md:flex, now always flex */}
        <nav className="flex flex-row items-center gap-5 text-sm">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4" aria-label="Go to Dashboard">
            <Image src={uewLogoPath} alt="UEW Logo" width={40} height={40} className="rounded-full border-2 border-white/80 shadow-md"/>
          </Link>
          {/* University Name */}
          <div className="hidden sm:flex items-center gap-2 leading-tight"> {/* Hide name on very small screens if needed */}
             <span className="font-semibold text-base">University of Education, Winneba</span>
             <span className="text-xs text-white/90">|</span>
             <span className="text-xs text-white/90">College for Distance and e-Learning</span>
          </div>
          {/* Add any other desktop links here if needed */}
        </nav>

        {/* Removed Mobile Navigation Trigger (Sheet) */}

        {/* Header Right Side Content */}
        {/* Use ml-auto to push dropdown to the right */}
        <div className="flex w-full items-center gap-4 ml-auto justify-end">
            {/* Avatar Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 focus-visible:ring-offset-blue-600">
                        <Avatar className="h-8 w-8 border border-white/50 shadow-sm">
                             <AvatarFallback className="bg-gradient-to-br from-blue-100 to-red-100 text-blue-800 font-semibold">
                                {isSessionLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : userInitials}
                             </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl">
                    <DropdownMenuLabel className="text-blue-600">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gradient-to-r from-blue-100 via-white to-red-100 h-[1px]"/>
                    <div className="px-2 py-1.5 text-sm font-normal text-gray-600">
                        Signed in as <span className="font-medium text-blue-600">{isSessionLoading ? "Loading..." : (userName || "User")}</span>
                    </div>
                    <DropdownMenuSeparator className="bg-gradient-to-r from-blue-100 via-white to-red-100 h-[1px]"/>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer transition-colors"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
       {/* Use white background for main content area */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:p-10 bg-white rounded-tl-xl shadow-inner"> {/* Added rounded corner and shadow */}
        {children}
      </main>

    </div>
  );
}
