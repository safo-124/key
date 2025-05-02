"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Menu, Home, Building, Users as UsersIcon, User as UserAvatarIcon, Loader2 } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';

const uewLogoPath = "/image.png";

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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("?");
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsSessionLoading(true);

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me');

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

    return () => { isMounted = false; };
  }, [router]);

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        console.log("Logged out successfully.");
        setUserName(null); setUserInitials("?"); setIsSessionLoading(true);
        router.push('/login');
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { href: "/registry", label: "Registry", icon: Building },
    { href: "/coordinator", label: "Coordinator Area", icon: UsersIcon },
    { href: "/lecturer", label: "Lecturer Area", icon: UsersIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-red-50">

      {/* Gradient Header with subtle blue to red transition */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 px-4 md:px-6 z-50 shadow-lg text-white">

        {/* Logo and Desktop Navigation - Now with horizontal text layout */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4" aria-label="Go to Dashboard">
            <Image src={uewLogoPath} alt="UEW Logo" width={40} height={40} className="rounded-full border-2 border-white/80 shadow-md"/>
          </Link>
          <div className="flex items-center gap-2 leading-tight">
             <span className="font-semibold text-base">University of Education, Winneba</span>
             <span className="text-xs text-white/90">|</span>
             <span className="text-xs text-white/90">College for Distance and e-Learning</span>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-white/10 border-white/30 hover:bg-white/20 text-white">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                         <Image src={uewLogoPath} alt="UEW Logo" width={32} height={32} className="rounded-full"/>
                        <span className="text-blue-600">UEW Claims</span>
                    </Link>
                    <Separator className="bg-gradient-to-r from-blue-100 via-white to-red-100 h-0.5"/>
                    {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                            <Link
                            href={link.href}
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                            <link.icon className="h-5 w-5" />
                            {link.label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>
                 <div className="mt-auto border-t border-gray-200 pt-4">
                     <p className="px-3 text-sm font-medium text-gray-600 truncate">
                         {isSessionLoading ? <Skeleton className="h-4 w-24 inline-block" /> : (userName || "User")}
                     </p>
                     <SheetClose asChild>
                         <Button variant="ghost" onClick={handleLogout} className="w-full justify-start mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                             <LogOut className="h-5 w-5" /> Logout
                         </Button>
                     </SheetClose>
                 </div>
            </SheetContent>
        </Sheet>

        {/* User Dropdown */}
        <div className="flex w-full items-center gap-4 md:ml-auto md:justify-end">
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

      {/* Main Content with full height and no padding */}
      <main className="flex-1 w-full">
        {children}
      </main>

    </div>
  );
}