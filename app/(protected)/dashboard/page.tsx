import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserSession, UserSession } from '@/lib/auth'; // Import the helper
import { Role } from '@prisma/client';
import prisma from '@/lib/prisma'; // Import Prisma client
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For warnings
import { Terminal } from 'lucide-react'; // Icon for Alert

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

  // Fetch assignment details based on role
  try {
    if (session.role === Role.COORDINATOR) {
      const center = await prisma.center.findUnique({
        where: { coordinatorId: session.userId },
        select: { id: true }, // Only select the ID
      });
      if (center) {
        centerId = center.id;
        console.log(`DashboardPage: Found center ${centerId} for Coordinator ${session.userId}`);
      } else {
        assignmentError = "You are registered as a Coordinator, but not assigned to a Center. Please contact the Registry.";
        console.warn(`DashboardPage: Coordinator ${session.userId} is not assigned to any center.`);
      }
    } else if (session.role === Role.LECTURER) {
      const userDetails = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { lecturerCenterId: true }, // Select the center ID field
      });
      if (userDetails?.lecturerCenterId) {
        centerId = userDetails.lecturerCenterId;
         console.log(`DashboardPage: Found center ${centerId} for Lecturer ${session.userId}`);
      } else {
        assignmentError = "You are registered as a Lecturer, but not assigned to a Center. Please contact your Coordinator or the Registry.";
        console.warn(`DashboardPage: Lecturer ${session.userId} does not have lecturerCenterId set.`);
      }
    }
  } catch (error) {
     console.error("DashboardPage: Error fetching user assignment:", error);
     assignmentError = "Could not retrieve your assignment details due to an error.";
  }


  // Render content based on the user's role
  const renderRoleSpecificContent = (
        session: NonNullable<UserSession>,
        fetchedCenterId: string | null,
        errorMsg: string | null
    ) => {

    // Show assignment error if present
    if (errorMsg) {
        return (
            <CardContent className="pt-4">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Assignment Issue</AlertTitle>
                    <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
            </CardContent>
        );
    }

    switch (session.role) {
      case Role.REGISTRY:
        return (
          <>
            <CardDescription>
              As a Registry administrator, you can manage centers, coordinators, and lecturers.
            </CardDescription>
            <CardContent className="pt-4">
              <p className="mb-4">Quick Actions:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button asChild>
                    <Link href="/registry/centers">Manage Centers</Link>
                 </Button>
                 {/* Add more registry-specific links/actions here */}
                 {/* Example: <Button asChild variant="secondary"><Link href="/registry/users">Manage Users</Link></Button> */}
              </div>
            </CardContent>
          </>
        );
      case Role.COORDINATOR:
        if (!fetchedCenterId) {
            // This case should ideally be caught by assignmentError, but added as a safeguard
             return <CardContent className="pt-4"><p className="text-destructive">Error: Center ID not found.</p></CardContent>;
        }
        return (
          <>
            <CardDescription>
              As a Center Coordinator, you manage departments, lecturers, and claims for your assigned center.
            </CardDescription>
             <CardContent className="pt-4">
                <p className="mb-4">Quick Actions for Your Center:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                        <Link href={`/coordinator/${fetchedCenterId}/claims`}>Review Claims</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={`/coordinator/${fetchedCenterId}/departments`}>Manage Departments</Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href={`/coordinator/${fetchedCenterId}/lecturers`}>View Lecturers</Link>
                    </Button>
                </div>
            </CardContent>
          </>
        );
      case Role.LECTURER:
         if (!fetchedCenterId) {
            // This case should ideally be caught by assignmentError, but added as a safeguard
            return <CardContent className="pt-4"><p className="text-destructive">Error: Center ID not found.</p></CardContent>;
         }
        return (
          <>
            <CardDescription>
              As a Lecturer, you can submit and view your claims within your assigned center.
            </CardDescription>
             <CardContent className="pt-4">
                <p className="mb-4">Claim Actions:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                        <Link href={`/lecturer/${fetchedCenterId}/claims/create`}>Submit New Claim</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={`/lecturer/${fetchedCenterId}/claims`}>View My Claims</Link>
                    </Button>
                </div>
            </CardContent>
          </>
        );
      default:
        return (
          <CardDescription>
            Your role is currently undefined. Please contact support.
          </CardDescription>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session.name || 'User'}!</CardTitle>
          <p className="text-sm text-muted-foreground">Your Role: <span className="font-medium text-primary">{session.role}</span></p>
        </CardHeader>
        {/* Render role-specific info inside the Card, passing fetched data */}
        {renderRoleSpecificContent(session, centerId, assignmentError)}
      </Card>

      {/* You could add more general dashboard widgets here */}

    </div>
  );
}
