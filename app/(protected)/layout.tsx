"use client"; // Needs to be client component for hooks and event handlers

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Menu, Home, Building, Users as UsersIcon, User as UserAvatarIcon, Loader2 } from 'lucide-react'; // Icons
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/lib/actions/auth.actions';
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
        const sessionCookie = cookies['app_session'];
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


// The main layout for authenticated users - Neutral Theme
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
             const emailInitial = userData.email?.[0]?.toUpperCase() || 'U';
             setUserInitials(emailInitial);
          }
        } else {
          console.error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
          if (response.status === 401) {
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

    return () => { isMounted = false; };
  }, [router]);


  // Handle logout action
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        console.log("Logged out successfully.");
        setUserName(null); setUserInitials("?"); setIsSessionLoading(true);
        router.push('/login');
      } else {
        console.error("Logout failed:", result.message);
        alert(result.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An unexpected error occurred during logout.");
    }
  };

  // Define navigation links for reuse in mobile sheet
  const navLinks = [
    // { href: "/dashboard", label: "Dashboard", icon: Home }, // Removed
    { href: "/registry", label: "Registry", icon: Building },
    { href: "/coordinator", label: "Coordinator Area", icon: UsersIcon },
    { href: "/lecturer", label: "Lecturer Area", icon: UsersIcon },
  ];

  return (
    // Use the base muted background for the entire layout container
    <div className="flex min-h-screen w-full flex-col bg-muted/40">

      {/* Main Header - Reverted to standard background */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50 shadow-sm">

        {/* Logo and Desktop Navigation placeholder */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {/* Logo Only */}
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4" aria-label="Go to Dashboard">
            {/* Removed border from logo */}
            <Image src={uewLogoPath} alt="UEW Logo" width={36} height={36} className="rounded-full"/>
          </Link>
          {/* Add any remaining desktop links here if needed */}
        </nav>

        {/* Mobile Navigation Trigger (Sheet) */}
        <Sheet>
            <SheetTrigger asChild>
                {/* Reverted button style */}
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            {/* Reverted SheetContent background */}
            <SheetContent side="left" className="flex flex-col bg-background">
                <nav className="grid gap-2 text-lg font-medium">
                    {/* Reverted mobile header style */}
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                         <Image src={uewLogoPath} alt="UEW Logo" width={32} height={32} className="rounded-full"/>
                        <span className="">UEW Claims</span> {/* Kept name here */}
                    </Link>
                    <Separator /> {/* Default separator */}
                    {/* Reverted mobile link styles */}
                    {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                            <Link
                            href={link.href}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                            <link.icon className="h-5 w-5" />
                            {link.label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>
                 <div className="mt-auto border-t pt-4">
                     <p className="px-3 text-sm font-medium text-muted-foreground truncate">
                         {isSessionLoading ? <Skeleton className="h-4 w-24 inline-block" /> : (userName || "User")}
                     </p>
                     <SheetClose asChild>
                        {/* Reverted mobile logout button style */}
                        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-destructive hover:text-destructive">
                            <LogOut className="h-5 w-5" /> Logout
                        </Button>
                    </SheetClose>
                 </div>
            </SheetContent>
        </Sheet>


        {/* Header Right Side Content */}
        <div className="flex w-full items-center gap-4 md:ml-auto md:justify-end">
           {/* Avatar Dropdown */}
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     {/* Reverted trigger button style */}
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                            {/* Reverted fallback style */}
                            <AvatarFallback>
                                {isSessionLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                 {/* Reverted dropdown content style */}
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-sm font-normal">
                        Signed in as <span className="font-medium">{isSessionLoading ? "Loading..." : (userName || "User")}</span>
                    </div>
                    <DropdownMenuSeparator />
                    {/* Reverted logout item style */}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
       {/* Reverted main background to match outer container, removed shadow/rounding */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:p-10">
        {children}
      </main>

    </div>
  );
}
