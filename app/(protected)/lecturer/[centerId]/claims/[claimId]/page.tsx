import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link';
import { format } from 'date-fns'; // For date formatting
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, ClaimStatus, Claim, User } from '@prisma/client'; // Prisma types and enums
import { Button } from '@/components/ui/button'; // Shadcn UI components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Clock, User as UserIcon, Calendar, DollarSign, FileText } from 'lucide-react'; // Icons

// Define props type including URL parameters
type ViewLecturerClaimPageProps = {
  params: {
    centerId: string; // Center ID from the URL
    claimId: string;  // Claim ID from the URL
  };
};

// Type for the detailed claim data, including optional processor info
type LecturerClaimDetails = Claim & {
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null; // Optional processor details
    // We don't need submitter details here as it's the current user
    // We don't need center details as it's implied by the URL and auth check
};

// Function to generate dynamic metadata for the page
export async function generateMetadata({ params }: ViewLecturerClaimPageProps): Promise<Metadata> {
  // Fetch minimal claim data for the title, performing an implicit access check
  const session = getCurrentUserSession();
  const claim = await prisma.claim.findFirst({
    where: {
        id: params.claimId,
        centerId: params.centerId,
        submittedById: session?.userId // Ensure claim belongs to the current user
    },
    select: { title: true },
  });

  return {
    title: claim ? `My Claim: ${claim.title}` : 'Claim Details',
    description: `Details for your submitted claim (ID: ${params.claimId}).`,
  };
}

// Helper function to format currency (same as coordinator's page)
const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // Adjust currency as needed
    }).format(amount);
};

// Helper function to render status badge (same as coordinator's page)
const renderStatusBadge = (status: ClaimStatus) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let Icon = Clock;
    if (status === ClaimStatus.APPROVED) { variant = "default"; Icon = CheckCircle; }
    if (status === ClaimStatus.REJECTED) { variant = "destructive"; Icon = XCircle; }
    return <Badge variant={variant} className="capitalize whitespace-nowrap"><Icon className="mr-1 h-3 w-3"/>{status.toLowerCase()}</Badge>;
};

// The View Claim Details Page component for Lecturers (Server Component)
export default async function ViewLecturerClaimPage({ params }: ViewLecturerClaimPageProps) {
  const { centerId, claimId } = params; // Extract IDs from URL
  const session = getCurrentUserSession(); // Get current user session

  // --- Authorization Check ---
  // 1. Must be a Lecturer
  if (session?.role !== Role.LECTURER) {
    redirect('/dashboard'); // Redirect non-lecturers
  }

  // 2. Fetch the specific claim, ensuring it belongs to the logged-in lecturer AND the center from the URL
  const claim: LecturerClaimDetails | null = await prisma.claim.findFirst({
    where: {
      id: claimId, // Match the claim ID
      centerId: centerId, // Match the center ID from the URL
      submittedById: session.userId, // **Crucial**: Ensure the claim was submitted by the current user
    },
    include: {
      // Include details of the user who processed the claim (if any)
      processedBy: { select: { id: true, name: true, email: true } },
    }
  });

  // 3. If claim not found (or doesn't meet the criteria), show "Not Found"
  if (!claim) {
     console.warn(`ViewLecturerClaimPage: Lecturer ${session.userId} failed access check for claim ${claimId} in center ${centerId}.`);
     // Use notFound() to render the nearest not-found.tsx file or a default 404 page
     notFound();
  }

  console.log(`ViewLecturerClaimPage: Displaying details for claim ${claim.id} for user ${session.userId}`);

  // --- Render Page ---
  return (
    <div className="space-y-6">
      {/* Back Button to the claims list for this center */}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/lecturer/${centerId}/claims`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Claims List
        </Link>
      </Button>

      {/* Main Claim Details Card */}
      <Card>
        <CardHeader>
          {/* Header with Title and Status Badge */}
          <div className="flex justify-between items-start gap-4">
             <div>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary"/> {/* Icon */}
                    Claim: {claim.title}
                </CardTitle>
                {/* Submitted Date */}
                <CardDescription>Submitted on {format(claim.submittedAt, "PPP")} ({format(claim.submittedAt, "p")})</CardDescription>
             </div>
             {/* Status Badge */}
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
            {claim.description ? ( // Only show description if it exists
                <div className="space-y-1 pt-2">
                    <h4 className="font-medium">Description / Justification:</h4>
                    {/* Use whitespace-pre-wrap to preserve line breaks */}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{claim.description}</p>
                </div>
            ) : (
                 <div className="pt-2">
                     <p className="text-sm text-muted-foreground italic">No description provided.</p>
                 </div>
            )}

            {/* Processing Info (Show only if claim is NOT PENDING) */}
            {claim.status !== ClaimStatus.PENDING && claim.processedAt && (
                 <div className="border-t pt-4 mt-4 space-y-2">
                    <h4 className="font-medium text-sm">Processing Details:</h4>
                    {/* Display who processed it */}
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserIcon className="h-4 w-4"/>
                        Processed by: {claim.processedBy?.name || claim.processedBy?.email || 'System'} {/* Fallback if processor details missing */}
                    </div>
                    {/* Display when it was processed */}
                     <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4"/>
                        Processed on: {format(claim.processedAt, "PPP p")} {/* Format date and time */}
                    </div>
                 </div>
            )}

        </CardContent>
        {/* Optional Footer - Could add edit/delete buttons here if status is PENDING */}
        {/* {claim.status === ClaimStatus.PENDING && (
             <CardFooter className="border-t pt-4 justify-end">
                 <Button variant="outline" size="sm" disabled>Edit Claim (TBD)</Button>
                 <Button variant="destructive" size="sm" disabled className="ml-2">Delete Claim (TBD)</Button>
             </CardFooter>
        )} */}
      </Card>

    </div>
  );
}
