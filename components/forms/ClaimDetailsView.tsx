"use client";

import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Printer, CheckCircle, XCircle, Clock, User as UserIcon, Calendar, DollarSign, FileText, BookOpen, Car, GraduationCap, Hash, MapPin, Clock4 } from 'lucide-react';
import { ClaimStatus, ClaimType, ThesisType, TransportType } from '@prisma/client';
import { ClaimActionButtonsClient } from '@/components/misc/ClaimActionButtonsClient';
import type { ClaimWithDetailsForView } from '@/app/(protected)/coordinator/[centerId]/claims/[claimId]/page';

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount);
};

const renderStatusBadge = (status: ClaimStatus) => {
    const variants = {
        [ClaimStatus.PENDING]: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
        [ClaimStatus.APPROVED]: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle },
        [ClaimStatus.REJECTED]: { bg: "bg-red-50", text: "text-red-700", icon: XCircle }
    };
    const { bg, text, icon: Icon } = variants[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            <Icon className="mr-1 h-3 w-3" />
            {status.toLowerCase()}
        </span>
    );
};

const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    return timeString;
};

const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    try {
        return format(new Date(date), "dd MMM yyyy");
    } catch { return 'Invalid Date'; }
};

const formatDateTime = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    try {
        return format(new Date(date), "dd MMM yyyy, h:mm a");
    } catch { return 'Invalid Date'; }
};

export function ClaimDetailsView({ claim, currentCoordinatorId }: { claim: ClaimWithDetailsForView, currentCoordinatorId: string }) {
    const [isPrinting, setIsPrinting] = React.useState(false);
    const printableRef = React.useRef<HTMLDivElement>(null);

    const handlePrintPdf = async () => {
        if (!printableRef.current) return;
        setIsPrinting(true);

        try {
            const canvas = await html2canvas(printableRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const pdf = new jsPDF('portrait', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth() - 30;
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = pdfWidth / imgWidth;
            const pdfHeight = imgHeight * ratio;
            
            pdf.addImage(imgData, 'PNG', 15, 15, pdfWidth, pdfHeight);
            pdf.save(`claim-${claim.id}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsPrinting(false);
        }
    };

    const getClaimIcon = () => {
        switch (claim.claimType) {
            case ClaimType.TEACHING: return <BookOpen className="h-5 w-5 text-blue-600" />;
            case ClaimType.TRANSPORTATION: return <Car className="h-5 w-5 text-blue-600" />;
            case ClaimType.THESIS_PROJECT: return <GraduationCap className="h-5 w-5 text-blue-600" />;
            default: return <FileText className="h-5 w-5 text-blue-600" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button 
                    onClick={handlePrintPdf} 
                    disabled={isPrinting} 
                    variant="outline"
                    className="border-gray-300"
                >
                    {isPrinting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Printer className="mr-2 h-4 w-4" />
                            Print to PDF
                        </>
                    )}
                </Button>
            </div>

            <Card ref={printableRef} className="border-gray-200 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                {getClaimIcon()}
                                {claim.claimType.replace('_', ' ')} Claim
                            </CardTitle>
                            <div className="mt-2 space-y-1">
                                <CardDescription className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-gray-500" />
                                    Submitted by: <span className="font-medium text-gray-700">{claim.submittedBy?.name || claim.submittedBy?.email || 'N/A'}</span>
                                </CardDescription>
                                <CardDescription className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    Submitted on: <span className="font-medium text-gray-700">{formatDateTime(claim.submittedAt)}</span>
                                </CardDescription>
                            </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            {renderStatusBadge(claim.status)}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Separator className="bg-gray-200" />

                    {/* Claim Type Specific Sections */}
                    {claim.claimType === ClaimType.TEACHING && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                Teaching Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">{formatDate(claim.teachingDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock4 className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium">
                                            {formatTime(claim.teachingStartTime)} - {formatTime(claim.teachingEndTime)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Contact Hours</p>
                                        <p className="font-medium">{claim.teachingHours || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {claim.claimType === ClaimType.TRANSPORTATION && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Car className="h-5 w-5 text-blue-600" />
                                Transportation Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-gray-700">
                                        {claim.transportType || 'N/A'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Amount Claimed</p>
                                        <p className="font-medium">{formatCurrency(claim.transportAmount)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">From</p>
                                        <p className="font-medium">{claim.transportDestinationFrom || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">To</p>
                                        <p className="font-medium">{claim.transportDestinationTo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {claim.claimType === ClaimType.THESIS_PROJECT && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                Thesis / Project Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-gray-700">
                                        {claim.thesisType || 'N/A'}
                                    </Badge>
                                </div>

                                {claim.thesisType === ThesisType.EXAMINATION && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Course Code</p>
                                                <p className="font-medium">{claim.thesisExamCourseCode || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Exam Date</p>
                                                <p className="font-medium">{formatDate(claim.thesisExamDate)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {claim.thesisType === ThesisType.SUPERVISION && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-gray-700">
                                                {claim.thesisSupervisionRank || 'N/A'}
                                            </Badge>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Supervised Students</h4>
                                            {claim.supervisedStudents && claim.supervisedStudents.length > 0 ? (
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50">
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
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No students listed</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <Separator className="bg-gray-200" />

                    {claim.status !== ClaimStatus.PENDING && claim.processedAt && (
                        <div className="space-y-2">
                            <h4 className="font-medium">Processing Details</h4>
                            <div className="flex items-center gap-2 text-sm">
                                <UserIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">Processed by: </span>
                                <span className="font-medium">{claim.processedBy?.name || claim.processedBy?.email || 'System'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">Processed on: </span>
                                <span className="font-medium">{formatDateTime(claim.processedAt)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>

                {claim.status === ClaimStatus.PENDING && (
                    <CardFooter className="border-t pt-4 justify-end">
                        <ClaimActionButtonsClient
                            claimId={claim.id}
                            centerId={claim.centerId}
                            coordinatorId={currentCoordinatorId}
                        />
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}