"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Building, Users, Home } from 'lucide-react';
import Image from 'next/image';

const uewLogoPath = "/image.png";

function RegistryNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/registry' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700 transition-all hover:bg-gradient-to-r hover:from-blue-100/70 hover:via-white hover:to-red-100/70 hover:text-blue-800",
        isActive && "bg-gradient-to-r from-blue-100/80 via-white to-red-100/80 text-blue-800 font-medium border-l-4 border-blue-600 shadow-sm"
      )}
    >
      {children}
    </Link>
  );
}

export default function RegistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] bg-gradient-to-br from-blue-50 via-white to-red-50">

      {/* Enhanced Sidebar with deeper gradients */}
      <div className="hidden border-r border-blue-300/30 bg-gradient-to-b from-blue-100/90 via-white to-red-100/90 md:block shadow-lg">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-[3.5rem]">
          {/* Vibrant Sidebar Header */}
          <div className="flex h-16 items-center border-b border-blue-300/30 px-4 lg:px-6 bg-gradient-to-r from-blue-200/80 via-white to-red-200/80">
            <Link href="/registry" className="flex items-center gap-3">
              <Image 
                src={uewLogoPath} 
                alt="UEW Logo" 
                width={32} 
                height={32} 
                className="rounded-full border-2 border-white shadow-md"
              />
              <span className="bg-gradient-to-r from-blue-900 to-red-700 bg-clip-text text-transparent font-semibold text-lg">
                Registry
              </span>
            </Link>
          </div>
          
          {/* Navigation Links with enhanced gradients */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start gap-1 px-3 text-sm font-medium">
              <RegistryNavLink href="/registry">
                <Home className="h-5 w-5 bg-gradient-to-r from-blue-700 to-red-600 bg-clip-text text-transparent" />
                <span>Dashboard</span>
              </RegistryNavLink>
              
              <div className="my-2 mx-4 h-px bg-gradient-to-r from-blue-300 via-white to-red-300"></div>
              
              <RegistryNavLink href="/registry/centers">
                <Building className="h-5 w-5 bg-gradient-to-r from-blue-700 to-red-600 bg-clip-text text-transparent" />
                <span>Centers</span>
              </RegistryNavLink>
              
              <div className="my-2 mx-4 h-px bg-gradient-to-r from-blue-300 via-white to-red-300"></div>
              
              <RegistryNavLink href="/registry/users">
                <Users className="h-5 w-5 bg-gradient-to-r from-blue-700 to-red-600 bg-clip-text text-transparent" />
                <span>Users</span>
              </RegistryNavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-white via-white to-red-50/30 rounded-tl-3xl shadow-inner">
          {children}
        </main>
      </div>
    </div> 
  );
}