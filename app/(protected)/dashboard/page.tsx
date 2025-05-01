// app/(protected)/dashboard/page.tsx

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma'; // Import Prisma client
import { getCurrentUserSession } from '@/lib/auth'; // Import the auth helper
import { Role, ClaimStatus } from '@prisma/client'; // Import enums
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Shadcn Card
import { Button } from '@/components/ui/button'; // Shadcn Button
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Shadcn Alert
import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import { Terminal, LayoutDashboard, Building, Users, FileText, Settings, FilePlus, AlertCircle, CheckCircle, XCircle, Clock, ArrowRight, Hand, Building2, Target, BookUser } from 'lucide-react'; // Icons

// Metadata for the page
export const metadata: Metadata = {
  title: 'Dashboard - UEW Claims Portal',
  description: 'Your main dashboard for the UEW Claims Management Portal.',
};

// Helper function to format numbers (optional)
const formatCount = (count: number): string => count.toLocaleString();

// Helper function to get the role-specific dashboard link base path
const getRoleDashboardBasePath = (role: Role): string => {
    switch (role) {
        case Role.REGISTRY: return '/registry';
        case Role.COORDINATOR: return '/coordinator';
        case Role.LECTURER: return '/lecturer';
        default: return '/dashboard'; // Fallback
    }
};

// The main Dashboard Page component (Server Component)
export default async function DashboardPage() {
  // Get the current user session on the server
  const session = getCurrentUserSession();

  // If no session, redirect to login
  if (!session) {
    console.log("DashboardPage: No session found, redirecting to login.");
    redirect('/login');
  }

  let centerId: string | null = null;
  let assignmentError: string | null = null;
  let centerName: string | null = null;
  let stats: any = {}; // To hold role-specific stats
  const roleDashboardBasePath = getRoleDashboardBasePath(session.role); // Get the base link path for the user's role

  // --- Fetch Role-Specific Data & Stats ---
  try {
    switch (session.role) {
      case Role.REGISTRY:
        const [centerCount, coordinatorCount, lecturerCount] = await Promise.all([
            prisma.center.count(),
            prisma.user.count({ where: { role: Role.COORDINATOR } }),
            prisma.user.count({ where: { role: Role.LECTURER } })
        ]);
        stats = { centerCount, coordinatorCount, lecturerCount };
        break;

      case Role.COORDINATOR:
        // Fetch the center assigned to this coordinator
        const centerData = await prisma.center.findUnique({
          where: { coordinatorId: session.userId }, // Find center by coordinator ID
          select: { id: true, name: true, _count: { select: { departments: true, lecturers: true, claims: { where: { status: ClaimStatus.PENDING } } } } },
        });
        if (centerData) {
          centerId = centerData.id; // Store the fetched center ID
          centerName = centerData.name;
          stats = { pendingClaims: centerData._count.claims, departmentCount: centerData._count.departments, lecturerCount: centerData._count.lecturers };
        } else {
          assignmentError = "You are registered as a Coordinator, but not assigned to a Center. Please contact the Registry.";
        }
        break;

      case Role.LECTURER:
        // Fetch the center assigned to this lecturer
        const lecturerData = await prisma.user.findUnique({
          where: { id: session.userId },
          select: { lecturerCenterId: true, lecturerCenter: { select: { name: true } } },
        });
        if (lecturerData?.lecturerCenterId) {
          centerId = lecturerData.lecturerCenterId; // Store the fetched center ID
          centerName = lecturerData.lecturerCenter?.name;
          // Fetch claim stats for this lecturer in their assigned center
          const claimCounts = await prisma.claim.groupBy({
              by: ['status'],
              where: { submittedById: session.userId, centerId: centerId },
              _count: { status: true }
          });
          stats = { pending: 0, approved: 0, rejected: 0 };
          claimCounts.forEach(item => {
              if (item.status === ClaimStatus.PENDING) stats.pending = item._count.status;
              if (item.status === ClaimStatus.APPROVED) stats.approved = item._count.status;
              if (item.status === ClaimStatus.REJECTED) stats.rejected = item._count.status;
          });
        } else {
          assignmentError = "You are registered as a Lecturer, but not assigned to a Center. Please contact your Coordinator or the Registry.";
        }
        break;
    }
  } catch (error) {
     console.error("DashboardPage: Error fetching role-specific data:", error);
     assignmentError = "Could not load all dashboard details due to an error.";
  }

  // --- Render Page Content ---

  // Display assignment error if present (for Coordinator/Lecturer)
  if (assignmentError && session.role !== Role.REGISTRY) {
       return (
           <div className="container mx-auto p-6">
               <Alert variant="destructive">
                   <Terminal className="h-4 w-4" />
                   <AlertTitle>Assignment Issue</AlertTitle>
                   <AlertDescription>{assignmentError}</AlertDescription>
               </Alert>
           </div>
       );
   }

  // Function to render content based on role
  const renderRoleDashboard = () => {
    // Construct the primary landing page link for the role
    let roleLandingPageLink = '#'; // Default to disabled link
    if (session.role === Role.REGISTRY) {
        roleLandingPageLink = roleDashboardBasePath; // Registry link is static
    } else if (centerId) {
        // For Coordinator and Lecturer, append the fetched centerId
        roleLandingPageLink = `${roleDashboardBasePath}/${centerId}`;
    }

    // Construct specific links for statistic cards (remain unchanged from previous version)
    let coordinatorClaimsLink = centerId ? `${roleDashboardBasePath}/${centerId}/claims?status=PENDING` : '#';
    let coordinatorDeptsLink = centerId ? `${roleDashboardBasePath}/${centerId}/departments` : '#';
    let coordinatorLecturersLink = centerId ? `${roleDashboardBasePath}/${centerId}/lecturers` : '#';
    let lecturerPendingLink = centerId ? `${roleDashboardBasePath}/${centerId}/claims?status=PENDING` : '#';
    let lecturerApprovedLink = centerId ? `${roleDashboardBasePath}/${centerId}/claims?status=APPROVED` : '#';
    let lecturerRejectedLink = centerId ? `${roleDashboardBasePath}/${centerId}/claims?status=REJECTED` : '#';
    let lecturerCreateLink = centerId ? `/lecturer/${centerId}/claims/create` : '#'; // Separate link for create

    // Common card hover styles
    const cardHoverStyle = "transition-all duration-200 hover:shadow-md hover:border-primary/50 hover:scale-[1.02]";

    switch (session.role) {
      case Role.REGISTRY:
        return (
          <>
            {/* Registry Stats - Clickable */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href={`${roleLandingPageLink}/centers`} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Centers</CardTitle><Building className="h-4 w-4 text-muted-foreground" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.centerCount)}</div></CardContent> </Card>
                </Link>
                <Link href={`${roleLandingPageLink}/users?role=COORDINATOR`} className="block">
                     <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Coordinators</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.coordinatorCount)}</div></CardContent> </Card>
                </Link>
                <Link href={`${roleLandingPageLink}/users?role=LECTURER`} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Lecturers</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.lecturerCount)}</div></CardContent> </Card>
                </Link>
            </div>
            {/* Registry Actions Card */}
            <Card className="border-l-4 border-red-700 bg-white shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Registry Administration</CardTitle>
                    <CardDescription>Access tools to manage centers and users.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* *** UPDATED BUTTON LINK to Registry Landing Page *** */}
                    <Button asChild className="bg-red-700 hover:bg-red-800 text-white shadow transition-transform duration-200 hover:scale-105">
                        <Link href={roleLandingPageLink}> <Target className="mr-2 h-4 w-4"/> Go to Registry Dashboard <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardContent>
            </Card>
          </>
        );

      case Role.COORDINATOR:
        return (
          <>
            <p className="text-lg text-muted-foreground">Managing Center: <strong>{centerName || 'N/A'}</strong></p>
            {/* Coordinator Stats - Clickable */}
            <div className="grid gap-4 md:grid-cols-3">
                 <Link href={coordinatorClaimsLink} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Claims</CardTitle><AlertCircle className={`h-4 w-4 ${stats.pendingClaims > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.pendingClaims)}</div><p className="text-xs text-muted-foreground">Awaiting review</p></CardContent> </Card>
                 </Link>
                 <Link href={coordinatorDeptsLink} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Departments</CardTitle><Building2 className="h-4 w-4 text-muted-foreground" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.departmentCount)}</div></CardContent> </Card>
                 </Link>
                 <Link href={coordinatorLecturersLink} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Lecturers</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.lecturerCount)}</div></CardContent> </Card>
                 </Link>
            </div>
             {/* Coordinator Actions Card */}
             <Card className="border-l-4 border-red-700 bg-white shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Coordinator Center Management</CardTitle>
                    <CardDescription>Access tools to manage your assigned center.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* *** UPDATED BUTTON LINK to Coordinator Landing Page *** */}
                    <Button asChild className="bg-red-700 hover:bg-red-800 text-white shadow transition-transform duration-200 hover:scale-105" disabled={roleLandingPageLink === '#'}>
                        <Link href={roleLandingPageLink}> <Target className="mr-2 h-4 w-4"/> Go to Center Dashboard <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardContent>
            </Card>
          </>
        );

      case Role.LECTURER:
        return (
            <>
            <p className="text-lg text-muted-foreground">Your assigned Center: <strong>{centerName || 'N/A'}</strong></p>
             {/* Lecturer Stats - Clickable */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href={lecturerPendingLink} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Claims</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.pending)}</div></CardContent> </Card>
                </Link>
                <Link href={lecturerApprovedLink} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved Claims</CardTitle><CheckCircle className="h-4 w-4 text-green-600" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.approved)}</div></CardContent> </Card>
                </Link>
                <Link href={lecturerRejectedLink} className="block">
                    <Card className={cardHoverStyle}> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Rejected Claims</CardTitle><XCircle className="h-4 w-4 text-red-600" /></CardHeader> <CardContent><div className="text-2xl font-bold">{formatCount(stats.rejected)}</div></CardContent> </Card>
                </Link>
            </div>
             {/* Lecturer Actions Card */}
             <Card className="border-l-4 border-red-700 bg-white shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Claim Actions</CardTitle>
                    <CardDescription>Submit new claims or view the status of existing ones.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    {/* *** UPDATED BUTTON LINK to Lecturer Landing Page *** */}
                    <Button asChild className="bg-red-700 hover:bg-red-800 text-white shadow transition-transform duration-200 hover:scale-105" disabled={roleLandingPageLink === '#'}>
                        <Link href={roleLandingPageLink}> <Target className="mr-2 h-4 w-4"/> Go to My Claims Dashboard <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                    {/* Submit New Claim button remains separate */}
                    <Button asChild variant="outline" disabled={lecturerCreateLink === '#'}>
                        <Link href={lecturerCreateLink}> <FilePlus className="mr-2 h-4 w-4"/> Submit New Claim</Link>
                    </Button>
                </CardContent>
            </Card>
           </>
        );

      default: // Should not happen
        return <p>Unknown user role. Please contact support.</p>;
    }
  };

  return (
    <div className="space-y-8"> {/* Increased spacing */}
      {/* Welcome Message Section - Redesigned */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-200">
          <div>
              {/* Larger, bolder welcome message */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                  <Hand className="h-8 w-8 text-yellow-500" /> {/* Waving hand icon */}
                  Welcome, {session.name || 'User'}!
              </h1>
              {/* Updated description */}
              <p className="text-lg text-muted-foreground mt-2">
                  This is your central dashboard for the UEW Claims Portal.
              </p>
          </div>
          {/* Themed role badge */}
          <Badge variant="outline" className="capitalize text-base mt-2 sm:mt-0 border-red-700 text-red-800 bg-red-50 px-3 py-1 rounded-full">
              {session.role.toLowerCase()}
          </Badge>
      </div>

       {/* Render Role-Specific Content */}
       <div className="space-y-6"> {/* Add spacing within role content */}
           {renderRoleDashboard()}
       </div>

    </div>
  );
}
