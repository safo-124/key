// components/claims/ClaimDetailsView.tsx
"use client";

import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { format } from 'date-fns'; // For date formatting
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Printer, CheckCircle, XCircle, Clock, User as UserIcon, Calendar, DollarSign, FileText, BookOpen, Car, GraduationCap, Hash, MapPin, Clock4 } from 'lucide-react';
import { ClaimStatus, Claim, User, SupervisedStudent, Center, ClaimType, ThesisType, TransportType } from '@prisma/client'; // Import necessary Prisma types

// Import the client component for action buttons (adjust path if needed)
import { ClaimActionButtonsClient } from '@/components/misc/ClaimActionButtonsClient';

// Define the type for the detailed claim data expected by this component
export type ClaimWithDetailsForView = Claim & {
    submittedBy: Pick<User, 'id' | 'name' | 'email'> | null;
    processedBy?: Pick<User, 'id' | 'name' | 'email'> | null;
    center: Pick<Center, 'id' | 'name' | 'coordinatorId'> | null; // Include coordinatorId
    supervisedStudents?: SupervisedStudent[];
};

// Define the props for this component
interface ClaimDetailsViewProps {
    claim: ClaimWithDetailsForView;
    currentCoordinatorId: string; // Receive coordinator's ID from server component
}

// Helper function to format currency (using GHS based on location)
const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount);
};

// Helper function to render status badge
const renderStatusBadge = (status: ClaimStatus) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let Icon = Clock;
    if (status === ClaimStatus.APPROVED) { variant = "default"; Icon = CheckCircle; }
    if (status === ClaimStatus.REJECTED) { variant = "destructive"; Icon = XCircle; }
    return <Badge variant={variant} className={`capitalize text-xs md:text-sm whitespace-nowrap`}><Icon className="mr-1 h-3 w-3"/>{status.toLowerCase()}</Badge>;
};

// Helper function to format time string (HH:MM)
const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    return timeString;
};

// Helper to format date/time
const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    try {
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return 'Invalid Date'; }
};
const formatDateTime = (date: Date | string | null | undefined) => {
     if (!date) return 'N/A';
     try {
         return new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
     } catch { return 'Invalid Date'; }
}


export function ClaimDetailsView({ claim, currentCoordinatorId }: ClaimDetailsViewProps) {
    const [isPrinting, setIsPrinting] = React.useState(false);
    const printableRef = React.useRef<HTMLDivElement>(null); // Ref for the printable area

    const handlePrintPdf = async () => {
        const elementToPrint = printableRef.current;
        if (!elementToPrint) {
             console.error("Printable element not found");
             return;
        }
        setIsPrinting(true);

        // No need to add temporary classes if root CSS is fixed

        try {
            // Ensure html2canvas is updated: `npm install html2canvas@latest`
            // Use standard options, relying on fixed root CSS
            const canvas = await html2canvas(elementToPrint, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff', // Still good practice to set explicit background
            });

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 210; // A4 width in mm
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const margin = 15; // mm
            const usablePdfWidth = pdfWidth - 2 * margin;
            const ratio = usablePdfWidth / imgWidth;
            const scaledImgHeight = imgHeight * ratio;
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', margin, margin, usablePdfWidth, scaledImgHeight);
            pdf.save(`claim-${claim.id}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            // General error message, as oklch should be resolved
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error generating PDF: ${errorMessage}. Check console for details.`);
        } finally {
            // No need to remove temporary classes
            setIsPrinting(false);
        }
    };

    return (
        <div className="space-y-6">
             {/* --- Print Button (Outside Printable Area) --- */}
            <div className="flex justify-end print:hidden">
                <Button onClick={handlePrintPdf} disabled={isPrinting} variant="outline">
                    {isPrinting ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating... </>
                    ) : (
                        <> <Printer className="mr-2 h-4 w-4" /> Print to PDF </>
                    )}
                </Button>
            </div>

            {/* --- Main Claim Details Card (Printable Area) --- */}
            {/* Apply ref here. No need for inline style overrides if root CSS is fixed */}
            <Card
                ref={printableRef}
                className="print:shadow-none print:border-none"
            >
                 {/* Removed the aggressive CSS override style block */}

                {/* Card Content - Renders normally using theme styles */}
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                {claim.claimType === ClaimType.TEACHING && <BookOpen className="h-5 w-5 text-primary"/>}
                                {claim.claimType === ClaimType.TRANSPORTATION && <Car className="h-5 w-5 text-primary"/>}
                                {claim.claimType === ClaimType.THESIS_PROJECT && <GraduationCap className="h-5 w-5 text-primary"/>}
                                Claim Details: {claim.claimType.replace('_', ' ')}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Submitted by: <strong>{claim.submittedBy?.name || claim.submittedBy?.email || 'N/A'}</strong> on {formatDateTime(claim.submittedAt)}
                            </CardDescription>
                             <CardDescription className="mt-1">
                                Center: <strong>{claim.center?.name || 'N/A'}</strong>
                            </CardDescription>
                        </div>
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
                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> <strong>Date:</strong> {formatDate(claim.teachingDate)}</div>
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

                            {claim.thesisType === ThesisType.EXAMINATION && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                                    <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground"/> <strong>Course Code:</strong> {claim.thesisExamCourseCode ?? 'N/A'}</div>
                                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> <strong>Exam Date:</strong> {formatDate(claim.thesisExamDate)}</div>
                                </div>
                            )}

                            {claim.thesisType === ThesisType.SUPERVISION && (
                                <div className="space-y-3 mt-2">
                                    <div className="flex items-center gap-2 text-sm"><strong>Supervision Rank:</strong> <Badge variant="outline" className="ml-1">{claim.thesisSupervisionRank ?? 'N/A'}</Badge></div>
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
                                            <p className="text-sm italic text-muted-foreground">No students listed for this supervision claim.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <Separator />
                    {claim.status !== ClaimStatus.PENDING && claim.processedAt && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Processing Details:</h4>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <UserIcon className="h-4 w-4"/>
                                Processed by: {claim.processedBy?.name || claim.processedBy?.email || 'System'}
                            </div>
                             <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4"/>
                                Processed on: {formatDateTime(claim.processedAt)}
                            </div>
                        </div>
                    )}

                </CardContent>

                {/* Actions Footer (only show for PENDING claims) */}
                {claim.status === ClaimStatus.PENDING && (
                    <CardFooter className="border-t pt-4 justify-end print:hidden">
                        <ClaimActionButtonsClient
                            claimId={claim.id}
                            centerId={claim.centerId}
                            coordinatorId={currentCoordinatorId}
                        />
                    </CardFooter>
                )}
            </Card>
            {/* --- End Printable Area / Card --- */}
        </div>
    );
}
