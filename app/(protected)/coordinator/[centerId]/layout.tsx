"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Role } from '@prisma/client';
import { LayoutDashboard, FileText, Building2, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

function CoordinatorNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export default function CoordinatorCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const centerId = params.centerId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [centerName, setCenterName] = useState<string | null>(null);
  const [isValidAccess, setIsValidAccess] = useState(false);

  useEffect(() => {
    const validateAndFetch = async () => {
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const fetchedName = `Center ${centerId.substring(0, 6)}...`;
            const accessGranted = true;

            if (accessGranted) {
                setCenterName(fetchedName);
                setIsValidAccess(true);
            } else {
                setIsValidAccess(false);
                console.error(`Access Denied: User does not coordinate center ${centerId}.`);
                router.push('/dashboard');
            }
        } catch (error) {
             console.error("Error validating center access:", error);
             setIsValidAccess(false);
             router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    if (centerId) {
        validateAndFetch();
    } else {
        console.error("CoordinatorCenterLayout: centerId is missing from params.");
        setIsValidAccess(false);
        router.push('/dashboard');
        setIsLoading(false);
    }
  }, [centerId, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex flex-col w-64 border-r p-4 space-y-4">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isValidAccess) {
    return null;
  }

  const basePath = `/coordinator/${centerId}`;

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 border-r bg-gradient-to-b from-blue-50 to-red-50 p-4 space-y-1">
        <div className="mb-6 px-2 py-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {centerName || 'Center Management'}
          </h2>
        </div>
        
        <nav className="space-y-1">
          <CoordinatorNavLink href={`${basePath}`}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </CoordinatorNavLink>
          <CoordinatorNavLink href={`${basePath}/claims`}>
            <FileText className="h-4 w-4" />
            <span>Claims</span>
          </CoordinatorNavLink>
          <CoordinatorNavLink href={`${basePath}/departments`}>
            <Building2 className="h-4 w-4" />
            <span>Departments</span>
          </CoordinatorNavLink>
          <CoordinatorNavLink href={`${basePath}/lecturers`}>
            <Users className="h-4 w-4" />
            <span>Lecturers</span>
          </CoordinatorNavLink>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Mobile Navigation (shown only on small screens) */}
          <div className="md:hidden flex overflow-x-auto pb-2 space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`${basePath}`}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Overview
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`${basePath}/claims`}>
                <FileText className="h-4 w-4 mr-2" />
                Claims
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`${basePath}/departments`}>
                <Building2 className="h-4 w-4 mr-2" />
                Departments
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`${basePath}/lecturers`}>
                <Users className="h-4 w-4 mr-2" />
                Lecturers
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            {centerName || 'Center Management'}
          </h1>

          {children}
        </div>
      </div>
    </div>
  );
}