import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link';
import { format } from 'date-fns'; // For date formatting
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, ClaimStatus, Claim, User, ClaimType, ThesisType, TransportType, SupervisedStudent } from '@prisma/client'; // Import necessary types/enums
import { Button } from '@/components/ui/button'; // Shadcn UI components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // To separate sections
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // For supervised students
import { ArrowLeft, CheckCircle, XCircle, Clock, User as UserIcon, Calendar, DollarSign, FileText, BookOpen, Car, GraduationCap, Hash, MapPin, Clock4 } from 'lucide-react'; // Icons
import { ClaimActionButtonsClient } from '@/components/misc/ClaimActionButtonsClient'; // Client component for action buttons

// Define props type including URL parameters
type ViewClaimPageProps = {
  params: {
    centerId: string; // Center ID from the URL
    claimId: string;  // Claim ID from the URL
  };
};

// Type for the detailed claim data, including related user and student details
type ClaimDetails = Claim & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'>; // Submitter details
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null; // Optional processor details
    center: { name: string; coordinatorId: string }; // Center details for auth check
    supervisedStudents: SupervisedStudent[]; // Include supervised students array
};

// Function to generate dynamic metadata for the page
export async function generateMetadata({ params }: ViewClaimPageProps): Promise<Metadata> {
  // Fetch minimal data for title, checking access implicitly
  const session = getCurrentUserSession();
  const claim = await prisma.claim.findFirst({
    where: {
        id: params.claimId,
        centerId: params.centerId,
        // Ensure the center is coordinated by the current user (basic check)
        center: {
            coordinatorId: session?.role === Role.COORDINATOR ? session.userId : undefined
        }
     },
    select: { claimType: true, center: { select: { name: true } } }, // Fetch type for better title
  });

  const claimTypeString = claim?.claimType ? ` (${claim.claimType.replace('_', ' ')})` : '';
  return {
    title: claim ? `Review Claim ${claimTypeString}` : 'Review Claim',
    description: `Review details for claim ${params.claimId} in center ${claim?.center?.name || params.centerId}.`,
  };
}

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat("en-US", { // TODO: Make locale/currency configurable
        style: "currency",
        currency: "USD",
    }).format(amount);
};

// Helper function to render status badge
const renderStatusBadge = (status: ClaimStatus) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let Icon = Clock;
    if (status === ClaimStatus.APPROVED) { variant = "default"; Icon = CheckCircle; }
    if (status === ClaimStatus.REJECTED) { variant = "destructive"; Icon = XCircle; }
    return <Badge variant={variant} className="capitalize text-xs md:text-sm whitespace-nowrap"><Icon className="mr-1 h-3 w-3"/>{status.toLowerCase()}</Badge>;
};

// Helper function to format time string (HH:MM)
const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    // Basic check, assumes HH:MM format. Add more robust parsing if needed.
    return timeString;
};

// The View Claim Details Page component for Coordinators (Server Component)
export default async function ViewClaimPage({ params }: ViewClaimPageProps) {
  const { centerId, claimId } = params; // Extract IDs from URL
  const session = getCurrentUserSession(); // Get current user session

  // --- Authorization Check ---
  // 1. Must be a Coordinator
  if (session?.role !== Role.COORDINATOR) {
    redirect('/dashboard'); // Redirect non-coordinators
  }

  // 2. Fetch the specific claim details, ensuring it belongs to the coordinator's center
  const claim: ClaimDetails | null = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
      processedBy: { select: { id: true, name: true, email: true } },
      center: { select: { name: true, coordinatorId: true } }, // Include center details
      supervisedStudents: true, // Include all fields for supervised students
    }
  });

  // 3. Validate fetched data
  //    a) Claim must exist
  //    b) Claim's centerId must match the URL centerId
  //    c) The center's coordinatorId must match the logged-in user's ID
  if (!claim || claim.centerId !== centerId || claim.center.coordinatorId !== session.userId) {
     console.warn(`ViewClaimPage: Coordinator ${session.userId} failed access check for claim ${claimId} in center ${centerId}.`);
     notFound(); // Show "Not Found" page
  }

  console.log(`ViewClaimPage: Displaying details for ${claim.claimType} claim ${claim.id} in center ${claim.center.name}`);

  // --- Render Page ---
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
          {/* Header with Claim Type, Submitter Info, and Status Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
             <div>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                    {/* Icon based on claim type */}
                    {claim.claimType === ClaimType.TEACHING && <BookOpen className="h-5 w-5 text-primary"/>}
                    {claim.claimType === ClaimType.TRANSPORTATION && <Car className="h-5 w-5 text-primary"/>}
                    {claim.claimType === ClaimType.THESIS_PROJECT && <GraduationCap className="h-5 w-5 text-primary"/>}
                    Claim Details: {claim.claimType.replace('_', ' ')}
                </CardTitle>
                <CardDescription className="mt-1">
                    Submitted by: <strong>{claim.submittedBy.name || claim.submittedBy.email}</strong> on {format(claim.submittedAt, "PPP")}
                </CardDescription>
             </div>
             {/* Status Badge */}
             <div className="mt-2 sm:mt-0">
                 {renderStatusBadge(claim.status)}
             </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
            <Separator />

            {/* --- TEACHING Section --- */}
            {claim.claimType === ClaimType.TEACHING && (
                <div className="space-y-3">
                     <h3 className="font-semibold text-lg mb-2">Teaching Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> <strong>Date:</strong> {claim.teachingDate ? format(claim.teachingDate, "PPP") : 'N/A'}</div>
                        <div className="flex items-center gap-2"><Clock4 className="h-4 w-4 text-muted-foreground"/> <strong>Start Time:</strong> {formatTime(claim.teachingStartTime)}</div>
                        <div className="flex items-center gap-2"><Clock4 className="h-4 w-4 text-muted-foreground"/> <strong>End Time:</strong> {formatTime(claim.teachingEndTime)}</div>
                     </div>
                     <div className="flex items-center gap-2 text-sm"><Hash className="h-4 w-4 text-muted-foreground"/> <strong>Contact Hours:</strong> {claim.teachingHours ?? 'N/A'}</div>
                </div>
            )}

            {/* --- TRANSPORTATION Section --- */}
            {claim.claimType === ClaimType.TRANSPORTATION && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-2">Transportation Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><strong>Type:</strong> <Badge variant="secondary" className="ml-1">{claim.transportType ?? 'N/A'}</Badge></div>
                        <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground"/> <strong>Amount Claimed:</strong> {formatCurrency(claim.transportAmount)}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <strong>From:</strong> {claim.transportDestinationFrom ?? 'N/A'}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <strong>To:</strong> {claim.transportDestinationTo ?? 'N/A'}</div>
                        {/* Show private vehicle details only if applicable */}
                        {claim.transportType === TransportType.PRIVATE && (
                            <>
                                <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground"/> <strong>Reg. Number:</strong> {claim.transportRegNumber ?? 'N/A'}</div>
                                <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground"/> <strong>Capacity (cc):</strong> {claim.transportCubicCapacity ?? 'N/A'}</div>
                            </>
                        )}
                    </div>
                </div>
            )}

             {/* --- THESIS/PROJECT Section --- */}
            {claim.claimType === ClaimType.THESIS_PROJECT && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2">Thesis / Project Information</h3>
                    <div className="flex items-center gap-2 text-sm"><strong>Type:</strong> <Badge variant="secondary" className="ml-1">{claim.thesisType ?? 'N/A'}</Badge></div>

                    {/* Examination Details */}
                    {claim.thesisType === ThesisType.EXAMINATION && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                            <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground"/> <strong>Course Code:</strong> {claim.thesisExamCourseCode ?? 'N/A'}</div>
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> <strong>Exam Date:</strong> {claim.thesisExamDate ? format(claim.thesisExamDate, "PPP") : 'N/A'}</div>
                        </div>
                    )}

                    {/* Supervision Details */}
                    {claim.thesisType === ThesisType.SUPERVISION && (
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2 text-sm"><strong>Supervision Rank:</strong> <Badge variant="outline" className="ml-1">{claim.thesisSupervisionRank ?? 'N/A'}</Badge></div>
                            {/* Supervised Students Table */}
                            <div>
                                <h4 className="font-medium text-sm mb-2">Supervised Students:</h4>
                                {claim.supervisedStudents && claim.supervisedStudents.length > 0 ? (
                                    <Table className="border">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Thesis/Project Title</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {claim.supervisedStudents.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium">{student.studentName}</TableCell>
                                                    <TableCell>{student.thesisTitle}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No students listed for this supervision claim.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Separator />

            {/* Processing Info (if applicable) */}
            {claim.status !== ClaimStatus.PENDING && claim.processedAt && (
                 <div className="space-y-2">
                    <h4 className="font-medium text-sm">Processing Details:</h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserIcon className="h-4 w-4"/>
                        Processed by: {claim.processedBy?.name || claim.processedBy?.email || 'System'} {/* Fallback if processor details missing */}
                    </div>
                     <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4"/>
                        Processed on: {format(claim.processedAt, "PPP p")} {/* Format date and time */}
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
                    coordinatorId={session.userId} // Pass coordinator's ID
                />
            </CardFooter>
        )}
      </Card>

    </div>
  );
}
