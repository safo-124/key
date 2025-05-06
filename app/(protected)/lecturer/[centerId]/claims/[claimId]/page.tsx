import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation'; // For handling errors and redirects
import Link from 'next/link';
import { format } from 'date-fns'; // For date formatting
import prisma from '@/lib/prisma'; // Prisma client for database access
import { getCurrentUserSession } from '@/lib/auth'; // Helper to get user session
import { Role, ClaimStatus, Claim, User, ClaimType, ThesisType, TransportType, SupervisedStudent } from '@prisma/client'; // Import necessary types/enums
import { Button } from '@/components/ui/button'; // Shadcn UI components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // To separate sections
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // For supervised students
import { ArrowLeft, CheckCircle, XCircle, Clock, User as UserIcon, Calendar, DollarSign, FileText, BookOpen, Car, GraduationCap, Hash, MapPin, Clock4 } from 'lucide-react'; // Icons

// Define props type including URL parameters
type ViewLecturerClaimPageProps = {
  params: {
    centerId: string; // Center ID from the URL
    claimId: string;  // Claim ID from the URL
  };
};

// Type for the detailed claim data, including optional processor info and students
type LecturerClaimDetails = Claim & {
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null; // Optional processor details
    supervisedStudents: SupervisedStudent[]; // Include supervised students array (will be empty if not supervision)
    // We don't need submitter details here as it's the current user
    center: { name: string }; // Include center name for context
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
    select: { claimType: true, center: { select: { name: true } } }, // Fetch type and center name
  });

  // Format the claim type for the title
  const claimTypeString = claim?.claimType ? ` (${claim.claimType.replace('_', ' ')})` : '';
  return {
    title: claim ? `My Claim Details${claimTypeString}` : 'Claim Details',
    description: `Details for your submitted claim (ID: ${params.claimId}) in center ${claim?.center?.name || params.centerId}.`,
  };
}

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    // TODO: Consider making locale and currency dynamic or configurable
    return new Intl.NumberFormat("en-US", {
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

// The View Claim Details Page component for Lecturers (Server Component)
export default async function ViewLecturerClaimPage({ params }: ViewLecturerClaimPageProps) {
  const { centerId, claimId } = params; // Extract IDs from URL
  const session = getCurrentUserSession(); // Get current user session

  // --- Authorization Check ---
  // 1. Must be a Lecturer
  if (session?.role !== Role.LECTURER) {
    console.warn(`ViewLecturerClaimPage: Non-lecturer user (Role: ${session?.role}) attempting access.`);
    redirect('/dashboard'); // Redirect non-lecturers
  }

  // 2. Fetch the specific claim, ensuring it belongs to the logged-in lecturer AND the center from the URL
  const claim: LecturerClaimDetails | null = await prisma.claim.findUnique({
    where: {
        id: claimId, // Match the claim ID
        // Add checks to ensure it belongs to the user and the correct center
        submittedById: session.userId,
        centerId: centerId,
    },
    include: {
      // Include details of the user who processed the claim (if any)
      processedBy: { select: { id: true, name: true, email: true } },
      // Include center name for context display
      center: { select: { name: true } },
      // Include supervised students relation
      supervisedStudents: true,
    }
  });

  // 3. If claim not found (or doesn't meet the criteria), show "Not Found"
  if (!claim) {
     console.warn(`ViewLecturerClaimPage: Lecturer ${session.userId} failed access check for claim ${claimId} in center ${centerId}.`);
     // Use notFound() to render the nearest not-found.tsx file or a default 404 page
     notFound();
  }

  console.log(`ViewLecturerClaimPage: Displaying details for ${claim.claimType} claim ${claim.id} for user ${session.userId}`);

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
      <Card className="overflow-hidden"> {/* Added overflow-hidden for potential table issues */}
        <CardHeader className="bg-muted/50">
          {/* Header with Claim Type, Submission Date, and Status Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
             <div>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                    {/* Icon based on claim type */}
                    {claim.claimType === ClaimType.TEACHING && <BookOpen className="h-5 w-5 text-primary"/>}
                    {claim.claimType === ClaimType.TRANSPORTATION && <Car className="h-5 w-5 text-primary"/>}
                    {claim.claimType === ClaimType.THESIS_PROJECT && <GraduationCap className="h-5 w-5 text-primary"/>}
                    Claim Details: {claim.claimType.replace('_', ' ')}
                </CardTitle>
                {/* Submitted Date */}
                <CardDescription className="mt-1 text-xs sm:text-sm">
                    Submitted on {format(claim.submittedAt, "PPP")} ({format(claim.submittedAt, "p")})
                    {' '}for Center: <strong>{claim.center.name}</strong>
                </CardDescription>
             </div>
             {/* Status Badge */}
             <div className="mt-2 sm:mt-0 flex-shrink-0">
                 {renderStatusBadge(claim.status)}
             </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4 md:p-6">
            {/* Separator for visual structure */}
            <Separator />

            {/* --- TEACHING Section --- */}
            {claim.claimType === ClaimType.TEACHING && (
                <div className="space-y-3">
                     <h3 className="font-semibold text-lg mb-2">Teaching Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Date:</strong> {claim.teachingDate ? format(claim.teachingDate, "PPP") : 'N/A'}</div>
                        <div className="flex items-center gap-2"><Clock4 className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Start Time:</strong> {formatTime(claim.teachingStartTime)}</div>
                        <div className="flex items-center gap-2"><Clock4 className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>End Time:</strong> {formatTime(claim.teachingEndTime)}</div>
                     </div>
                     <div className="flex items-center gap-2 text-sm pt-2"><Hash className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Contact Hours:</strong> {claim.teachingHours ?? 'N/A'}</div>
                </div>
            )}

            {/* --- TRANSPORTATION Section --- */}
            {claim.claimType === ClaimType.TRANSPORTATION && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-2">Transportation Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><strong>Type:</strong> <Badge variant="secondary" className="ml-1">{claim.transportType ?? 'N/A'}</Badge></div>
                        <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Amount Claimed:</strong> {formatCurrency(claim.transportAmount)}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>From:</strong> {claim.transportDestinationFrom ?? 'N/A'}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>To:</strong> {claim.transportDestinationTo ?? 'N/A'}</div>
                        {/* Show private vehicle details only if applicable */}
                        {claim.transportType === TransportType.PRIVATE && (
                            <>
                                <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Reg. Number:</strong> {claim.transportRegNumber ?? 'N/A'}</div>
                                <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Capacity (cc):</strong> {claim.transportCubicCapacity ?? 'N/A'}</div>
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
                            <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Course Code:</strong> {claim.thesisExamCourseCode ?? 'N/A'}</div>
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0"/> <strong>Exam Date:</strong> {claim.thesisExamDate ? format(claim.thesisExamDate, "PPP") : 'N/A'}</div>
                        </div>
                    )}

                    {/* Supervision Details */}
                    {claim.thesisType === ThesisType.SUPERVISION && (
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2 text-sm"><strong>Supervision Rank:</strong> <Badge variant="outline" className="ml-1">{claim.thesisSupervisionRank ?? 'N/A'}</Badge></div>
                            {/* Supervised Students Table */}
                            <div>
                                <h4 className="font-medium text-sm mb-2 mt-3">Supervised Students:</h4>
                                {claim.supervisedStudents && claim.supervisedStudents.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Thesis/Project Title</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {claim.supervisedStudents.map((student) => (
                                                    <TableRow key={student.id}>
                                                        <TableCell className="font-medium py-2 px-3">{student.studentName}</TableCell>
                                                        <TableCell className="py-2 px-3">{student.thesisTitle}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No students listed for this supervision claim.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Separator before processing info */}
            <Separator />

            {/* Processing Info (Show only if claim is NOT PENDING) */}
            {claim.status !== ClaimStatus.PENDING && claim.processedAt && (
                 <div className="space-y-2">
                    <h4 className="font-medium text-sm">Processing Details:</h4>
                    {/* Display who processed it */}
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserIcon className="h-4 w-4 flex-shrink-0"/>
                        <span>Processed by: {claim.processedBy?.name || claim.processedBy?.email || 'System'}</span> {/* Fallback if processor details missing */}
                    </div>
                    {/* Display when it was processed */}
                     <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0"/>
                        <span>Processed on: {format(claim.processedAt, "PPP p")}</span> {/* Format date and time */}
                    </div>
                 </div>
            )}
            {/* Show message if still pending */}
             {claim.status === ClaimStatus.PENDING && (
                 <p className="text-sm text-muted-foreground italic">This claim is awaiting review by the coordinator.</p>
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
