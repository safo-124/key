import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns'; // For date formatting
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus, Claim, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, Clock, User as UserIcon, Calendar, DollarSign, FileText } from 'lucide-react'; // Icons
import { ClaimActionButtonsClient } from '@/components/misc/ClaimActionButtonsClient'; // Client component for buttons

// Define props type including URL parameters
type ViewClaimPageProps = {
  params: {
    centerId: string;
    claimId: string;
  };
};

// Type for claim data including related user details
type ClaimDetails = Claim & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'>;
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null; // Optional processor details
    center: { name: string; coordinatorId: string }; // Include center name and coordinator ID for auth
};

// Generate dynamic metadata
export async function generateMetadata({ params }: ViewClaimPageProps): Promise<Metadata> {
  // Fetch minimal data for title, checking access implicitly
  const session = getCurrentUserSession(); // Assume session is available server-side
  const claim = await prisma.claim.findFirst({
    where: {
        id: params.claimId,
        centerId: params.centerId,
        // Ensure the center is coordinated by the current user
        center: {
            coordinatorId: session?.role === Role.COORDINATOR ? session.userId : undefined
        }
     },
    select: { title: true, center: { select: { name: true } } },
  });

  return {
    title: claim ? `Claim: ${claim.title}` : 'Claim Details',
    description: `Details for claim ${params.claimId} in center ${claim?.center?.name || params.centerId}.`,
  };
}

// Helper function to format currency
const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // Adjust currency as needed
    }).format(amount);
};

// Helper function to render status badge
const renderStatusBadge = (status: ClaimStatus) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let Icon = Clock;
    if (status === ClaimStatus.APPROVED) { variant = "default"; Icon = CheckCircle; }
    if (status === ClaimStatus.REJECTED) { variant = "destructive"; Icon = XCircle; }
    return <Badge variant={variant} className="capitalize"><Icon className="mr-1 h-3 w-3"/>{status.toLowerCase()}</Badge>;
};

// The View Claim Details Page component (Server Component)
export default async function ViewClaimPage({ params }: ViewClaimPageProps) {
  const { centerId, claimId } = params;
  const session = getCurrentUserSession();

  // --- Authorization Check ---
  if (session?.role !== Role.COORDINATOR) {
    redirect('/dashboard');
  }

  // Fetch the specific claim details, ensuring it belongs to the coordinator's center
  const claim: ClaimDetails | null = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
      processedBy: { select: { id: true, name: true, email: true } }, // Include who processed it
      center: { select: { name: true, coordinatorId: true } } // Include center details for auth check
    }
  });

  // Validate fetched data
  // 1. Claim must exist
  // 2. Claim's centerId must match the URL centerId
  // 3. The center's coordinatorId must match the logged-in user's ID
  if (!claim || claim.centerId !== centerId || claim.center.coordinatorId !== session.userId) {
     console.warn(`ViewClaimPage: Coordinator ${session.userId} failed access check for claim ${claimId} in center ${centerId}.`);
     // Show "Not Found" which is appropriate if the claim doesn't exist *for this user*
     notFound();
  }

  console.log(`ViewClaimPage: Displaying details for claim ${claim.id} in center ${claim.center.name}`);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/coordinator/${centerId}/claims`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Claims List
        </Link>
      </Button>

      {/* Main Claim Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
             <div>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary"/>
                    Claim Details: {claim.title}
                </CardTitle>
                <CardDescription>Submitted by {claim.submittedBy.name || claim.submittedBy.email} on {format(claim.submittedAt, "PPP")}</CardDescription>
             </div>
             {renderStatusBadge(claim.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Amount */}
            <div className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="h-5 w-5 text-muted-foreground"/>
                Amount Claimed: {formatCurrency(claim.amount)}
            </div>

            {/* Description */}
            {claim.description && (
                <div className="space-y-1">
                    <h4 className="font-medium">Description:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{claim.description}</p>
                </div>
            )}

            {/* Processing Info (if applicable) */}
            {claim.status !== ClaimStatus.PENDING && claim.processedAt && (
                 <div className="border-t pt-4 mt-4 space-y-2">
                    <h4 className="font-medium text-sm">Processing Details:</h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserIcon className="h-4 w-4"/>
                        Processed by: {claim.processedBy?.name || claim.processedBy?.email || 'N/A'}
                    </div>
                     <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4"/>
                        Processed on: {format(claim.processedAt, "PPP p")}
                    </div>
                 </div>
            )}

        </CardContent>
        {/* Actions Footer (only show for PENDING claims) */}
        {claim.status === ClaimStatus.PENDING && (
            <CardFooter className="border-t pt-4 justify-end">
                {/* Use Client Component for buttons to handle state and actions */}
                <ClaimActionButtonsClient
                    claimId={claim.id}
                    centerId={centerId}
                    coordinatorId={session.userId}
                />
            </CardFooter>
        )}
      </Card>

    </div>
  );
}
