"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, Clock, Loader2, FileText, Eye, BookOpen, Car, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ClaimStatus, ClaimType, ThesisType, Role } from "@prisma/client";
import type { ClaimForCoordinatorView } from "@/app/(protected)/coordinator/[centerId]/claims/page";
import { approveClaim, rejectClaim } from "@/lib/actions/coordinator.actions";

function ClaimActionButtons({ claim, centerId, currentUserId, userRole, onActionStart, onActionEnd }: {
    claim: ClaimForCoordinatorView;
    centerId: string;
    currentUserId: string;
    userRole: Role;
    onActionStart: () => void;
    onActionEnd: () => void;
}) {
    const router = useRouter();
    const [isApproving, setIsApproving] = React.useState(false);
    const [isRejecting, setIsRejecting] = React.useState(false);
    const isLoading = isApproving || isRejecting;

    if (claim.status !== ClaimStatus.PENDING || (userRole !== Role.COORDINATOR && userRole !== Role.REGISTRY)) {
        return null;
    }

    const handleApprove = async () => {
        setIsApproving(true);
        onActionStart();
        try {
            const result = await approveClaim({ claimId: claim.id, centerId, coordinatorId: currentUserId });
            if (result.success) {
                toast.success(result.message || "Claim approved successfully.");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to approve claim.");
            }
        } catch (e) {
            console.error("Client error approving claim:", e);
            toast.error("An unexpected error occurred while approving.");
        } finally {
            setIsApproving(false);
            onActionEnd();
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        onActionStart();
        try {
            const result = await rejectClaim({ claimId: claim.id, centerId, coordinatorId: currentUserId });
            if (result.success) {
                toast.success(result.message || "Claim rejected successfully.");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to reject claim.");
            }
        } catch (e) {
            console.error("Client error rejecting claim:", e);
            toast.error("An unexpected error occurred while rejecting.");
        } finally {
            setIsRejecting(false);
            onActionEnd();
        }
    };

    return (
        <div className="flex items-center justify-end space-x-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                            onClick={handleApprove} 
                            disabled={isLoading}
                        >
                            {isApproving ? <Loader2 className="animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Approve</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={handleReject} 
                            disabled={isLoading}
                        >
                            {isRejecting ? <Loader2 className="animate-spin" /> : <XCircle className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reject</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

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

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount);
};

const getColumns = (
    centerId: string,
    currentUserId: string,
    userRole: Role,
    setRowLoading: (rowId: string, isLoading: boolean) => void
): ColumnDef<ClaimForCoordinatorView>[] => [
    {
        accessorKey: "claimType",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Type <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const type = row.original.claimType;
            const Icon = type === ClaimType.TEACHING ? BookOpen :
                         type === ClaimType.TRANSPORTATION ? Car :
                         type === ClaimType.THESIS_PROJECT ? GraduationCap : FileText;
            return (
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="capitalize">{type.toLowerCase().replace('_', ' ')}</span>
                </div>
            );
        },
    },
    {
        id: "details",
        header: "Details",
        cell: ({ row }) => {
            const claim = row.original;
            let detailText = '';
            if (claim.claimType === ClaimType.TEACHING && claim.teachingDate) {
                detailText = `Teaching on ${format(claim.teachingDate, "PP")}`;
            } else if (claim.claimType === ClaimType.TRANSPORTATION) {
                detailText = `${claim.transportDestinationFrom} → ${claim.transportDestinationTo}`;
            } else if (claim.claimType === ClaimType.THESIS_PROJECT) {
                detailText = claim.thesisType === ThesisType.SUPERVISION ? 'Supervision' :
                             claim.thesisType === ThesisType.EXAMINATION ? `Exam: ${claim.thesisExamCourseCode}` :
                             'Thesis/Project';
            }
            return <div className="text-sm text-gray-600">{detailText || `Claim ID: ${claim.id.substring(0, 8)}...`}</div>;
        },
    },
    {
        accessorKey: "submittedBy.name",
        header: "Submitted By",
        cell: ({ row }) => {
            const submitter = row.original.submittedBy;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{submitter.name || 'Unnamed User'}</span>
                    <span className="text-xs text-gray-500">{submitter.email}</span>
                </div>
            );
        },
    },
    {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-medium text-gray-900">
                {formatCurrency(row.original.transportAmount)}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => renderStatusBadge(row.getValue("status")),
    },
    {
        accessorKey: "submittedAt",
        header: "Submitted",
        cell: ({ row }) => {
            const date = new Date(row.getValue("submittedAt"));
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="text-sm text-gray-600">
                                {format(date, "MMM d, yyyy")}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {format(date, "PPpp")}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const claim = row.original;
            const viewDetailsUrl = userRole === Role.REGISTRY
                ? `/registry/centers/${centerId}/claims/${claim.id}`
                : `/coordinator/${centerId}/claims/${claim.id}`;

            return (
                <div className="flex justify-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={viewDetailsUrl}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <ClaimActionButtons
                        claim={claim}
                        centerId={centerId}
                        currentUserId={currentUserId}
                        userRole={userRole}
                        onActionStart={() => setRowLoading(row.id, true)}
                        onActionEnd={() => setRowLoading(row.id, false)}
                    />
                </div>
            );
        },
    },
];

interface ClaimsTableProps {
    centerId: string;
    claims: ClaimForCoordinatorView[];
    currentUserId: string;
    userRole: Role;
}

export function ClaimsTable({ centerId, claims, currentUserId, userRole }: ClaimsTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'status', desc: false },
        { id: 'submittedAt', desc: true }
    ]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowLoadingState, setRowLoadingState] = React.useState<Record<string, boolean>>({});

    const setRowLoading = (rowId: string, isLoading: boolean) => {
        setRowLoadingState(prev => ({ ...prev, [rowId]: isLoading }));
    };

    const columns = React.useMemo(
        () => getColumns(centerId, currentUserId, userRole, setRowLoading),
        [centerId, currentUserId, userRole]
    );

    const table = useReactTable({
        data: claims,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
        initialState: { pagination: { pageSize: 10 } },
    });

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="px-4 py-3">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    className={rowLoadingState[row.id] ? 'bg-gray-50' : ''}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No claims found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}