// components/nav/LecturerNavLink.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LecturerNavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function LecturerNavLink({ href, children, icon }: LecturerNavLinkProps) {
  const pathname = usePathname();
  const params = useParams();
  const basePath = params?.centerId ? `/lecturer/${params.centerId}` : null;

  const isActive = pathname === href || (basePath && href !== basePath && pathname.startsWith(href));

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
          "text-sm font-medium text-blue-800", // Blue text
          "hover:bg-blue-50 hover:text-blue-900", // Light blue hover
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          isActive && "bg-blue-100 text-blue-900 font-semibold border-l-4 border-blue-600", // Active state
          "group"
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon && (
          <span className={cn(
            "flex items-center justify-center",
            "text-blue-600 group-hover:text-blue-700", // Blue icon colors
            isActive && "text-blue-700" // Darker blue when active
          )}>
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
        
        {isActive && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" /> // Blue active indicator
        )}
      </Link>
    </li>
  );
}