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
import { ArrowUpDown, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { ClaimStatus, ClaimType } from "@prisma/client";

export type LecturerClaim = {
    id: string;
    claimType: ClaimType;
    title: string | null;
    amount: number | null;
    status: ClaimStatus;
    submittedAt: Date;
    processedAt: Date | null;
    transportDestinationTo?: string | null;
    transportDestinationFrom?: string | null;
    thesisType?: string | null;
    thesisExamCourseCode?: string | null;
};

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const renderStatusBadge = (status: ClaimStatus) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let Icon = Clock;
    let className = "bg-blue-100 text-blue-800 border-blue-200";
    
    if (status === ClaimStatus.APPROVED) { 
        variant = "default"; 
        Icon = CheckCircle;
        className = "bg-blue-600 hover:bg-blue-700 text-white";
    }
    if (status === ClaimStatus.REJECTED) { 
        variant = "destructive"; 
        Icon = XCircle;
        className = "bg-red-600 hover:bg-red-700 text-white";
    }
    
    return (
        <Badge variant={variant} className={`capitalize whitespace-nowrap text-xs ${className}`}>
            <Icon className="mr-1 h-3 w-3"/>
            {status.toLowerCase()}
        </Badge>
    );
};

const getColumns = (centerId: string): ColumnDef<LecturerClaim>[] => [
  {
    accessorKey: "claimType",
    header: ({ column }) => (
        <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-blue-800 hover:bg-blue-50"
        >
          Type <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const type = row.getValue("claimType") as ClaimType;
        const formattedType = type.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        return <span className="font-medium text-sm text-blue-900">{formattedType}</span>;
    },
    enableSorting: true,
  },
  {
    id: "details",
    header: "Details / Title",
    cell: ({ row }) => {
        const claim = row.original;
        let detailText = claim.title || '';

        if (claim.claimType === ClaimType.TRANSPORTATION) {
            detailText = `From: ${claim.transportDestinationFrom || '?'} To: ${claim.transportDestinationTo || '?'}`;
        } else if (claim.claimType === ClaimType.THESIS_PROJECT) {
            detailText = claim.thesisType === 'SUPERVISION' ? 'Supervision' :
                         claim.thesisType === 'EXAMINATION' ? `Exam: ${claim.thesisExamCourseCode || '?'}` :
                         'Thesis/Project';
        }
        if (!detailText) detailText = `Claim ID: ${claim.id.substring(0, 8)}...`;

        return <div className="text-sm text-blue-700 truncate max-w-[200px] md:max-w-xs" title={detailText}>{detailText}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
        <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-blue-800 hover:bg-blue-50 justify-end w-full"
        >
          Amount <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const amount = row.getValue("amount") as number | null;
        return <div className="text-right font-mono text-sm whitespace-nowrap text-blue-900">{formatCurrency(amount)}</div>;
    },
    sortingFn: 'basic',
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => renderStatusBadge(row.getValue("status") as ClaimStatus),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => (
        <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-blue-800 hover:bg-blue-50"
        >
          Submitted <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const date = new Date(row.getValue("submittedAt"));
        const formattedDate = format(date, "PP");
        const fullDate = format(date, "PPP p");
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger className="text-sm text-blue-700 whitespace-nowrap">{formattedDate}</TooltipTrigger>
                    <TooltipContent className="bg-blue-50 border-blue-200 text-blue-800">
                        <p>{fullDate}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
    enableSorting: true,
  },
  {
    accessorKey: "processedAt",
    header: ({ column }) => (
        <Button 
            variant="ghost" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-blue-800 hover:bg-blue-50"
        >
          Processed <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const dateValue = row.getValue("processedAt");
        if (!dateValue) return <span className="text-xs text-blue-400">-</span>;

        const date = new Date(dateValue as string);
        const formattedDate = format(date, "PP");
        const fullDate = format(date, "PPP p");
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger className="text-sm text-blue-700 whitespace-nowrap">{formattedDate}</TooltipTrigger>
                    <TooltipContent className="bg-blue-50 border-blue-200 text-blue-800">
                        <p>{fullDate}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const claim = row.original;
      return (
        <div className="text-right">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                            asChild
                        >
                            <Link href={`/lecturer/${centerId}/claims/${claim.id}`} aria-label="View Claim Details">
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-blue-50 border-blue-200 text-blue-800">
                        <p>View Details</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      );
    },
    enableSorting: false,
  },
];

interface LecturerClaimsTableProps {
  claims: LecturerClaim[];
}

export function LecturerClaimsTable({ claims }: LecturerClaimsTableProps) {
  const params = useParams();
  const centerId = params.centerId as string;

  const [sorting, setSorting] = React.useState<SortingState>([
      { id: 'submittedAt', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns = React.useMemo(() => getColumns(centerId), [centerId]);

  const table = useReactTable({
    data: claims,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
        sorting,
        columnFilters,
    },
    initialState: {
        pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-blue-100 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-blue-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-blue-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-blue-800">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-blue-50 hover:bg-blue-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2 px-3 md:px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-blue-800">
                  You have not submitted any claims for this center yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-2">
         <Button
           variant="outline"
           size="sm"
           onClick={() => table.previousPage()}
           disabled={!table.getCanPreviousPage()}
           className="border-blue-200 text-blue-800 hover:bg-blue-50 hover:text-blue-900"
         >
           Previous
         </Button>
         <Button
           variant="outline"
           size="sm"
           onClick={() => table.nextPage()}
           disabled={!table.getCanNextPage()}
           className="border-blue-200 text-blue-800 hover:bg-blue-50 hover:text-blue-900"
         >
           Next
         </Button>
       </div>
    </div>
  );
}