// components/tables/ClaimsTable.tsx
"use client"; // This component uses hooks, so it's a Client Component

import * as React from "react";
import {
  ColumnDef, // Type for defining table columns
  flexRender, // Helper for rendering components in cells/headers
  getCoreRowModel, // Core table logic
  useReactTable, // Hook to create table instance
  getPaginationRowModel, // Enables pagination
  getSortedRowModel, // Enables sorting
  SortingState, // Type for sorting state
  getFilteredRowModel, // Enables filtering
  ColumnFiltersState // Type for filtering state
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, Clock, Loader2, FileText, Eye, BookOpen, Car, GraduationCap } from "lucide-react"; // Icons
import { useRouter } from 'next/navigation'; // Use router for refresh
import { format } from 'date-fns'; // For formatting dates
import Link from "next/link"; // For linking to detail view

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // For status display
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"; // For showing full dates/names on hover
import { Input } from "@/components/ui/input"; // For potential filtering
import { toast } from "sonner"; // For notifications
import { ClaimStatus, ClaimType, ThesisType, Role } from "@prisma/client"; // Import necessary Prisma enums, including Role

// Import type definition from the page component (adjust path if needed)
// Using the Coordinator view type, assuming Registry needs the same fields for the table
import type { ClaimForCoordinatorView } from "@/app/(protected)/coordinator/[centerId]/claims/page"; // Adjust path if needed for Registry type definition if it differs

// Import server actions for approving/rejecting claims
// ** IMPORTANT: These actions MUST be updated server-side to allow REGISTRY role **
// Consider creating separate actions or modifying these to check for either role.
import { approveClaim, rejectClaim } from "@/lib/actions/coordinator.actions";

// --- Helper Sub-Component: Action Buttons ---
// Renders Approve/Reject buttons for PENDING claims
// Now considers the userRole prop
interface ClaimActionButtonsProps {
    claim: ClaimForCoordinatorView;
    centerId: string;
    currentUserId: string; // User ID (Coordinator or Registry)
    userRole: Role; // Role of the current user
    onActionStart: () => void; // Callback when an action starts
    onActionEnd: () => void;   // Callback when an action finishes
}

function ClaimActionButtons({ claim, centerId, currentUserId, userRole, onActionStart, onActionEnd }: ClaimActionButtonsProps) {
    const router = useRouter();
    const [isApproving, setIsApproving] = React.useState(false);
    const [isRejecting, setIsRejecting] = React.useState(false);
    const isLoading = isApproving || isRejecting;

    // ** UPDATED: Only render buttons if the user is Coordinator or Registry AND claim is PENDING **
    if (claim.status !== ClaimStatus.PENDING || (userRole !== Role.COORDINATOR && userRole !== Role.REGISTRY)) {
        return null; // Hide buttons if claim not pending or user role is not allowed
    }

    // Handler for the Approve action
    const handleApprove = async () => {
        setIsApproving(true);
        onActionStart();
        try {
            // Pass necessary IDs - server action handles authorization based on role/ID
            // ** IMPORTANT: `approveClaim` action needs update for Registry authorization **
            const result = await approveClaim({ claimId: claim.id, centerId, coordinatorId: currentUserId }); // Using 'coordinatorId' param name, action must handle it
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

    // Handler for the Reject action
    const handleReject = async () => {
        setIsRejecting(true);
        onActionStart();
         try {
            // Pass necessary IDs - server action handles authorization based on role/ID
            // ** IMPORTANT: `rejectClaim` action needs update for Registry authorization **
            const result = await rejectClaim({ claimId: claim.id, centerId, coordinatorId: currentUserId }); // Using 'coordinatorId' param name, action must handle it
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

    // Render Approve and Reject buttons
    return (
        <div className="flex items-center justify-end space-x-1 md:space-x-2"> {/* Reduced spacing */}
            <TooltipProvider delayDuration={100}>
                {/* Approve Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                            variant="outline" size="icon"
                            className="h-8 w-8 border-green-500 text-green-600 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/50"
                            onClick={handleApprove} disabled={isLoading} aria-label="Approve Claim"
                        >
                            {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> <p>Approve</p> </TooltipContent>
                </Tooltip>
                {/* Reject Button */}
                 <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                            variant="outline" size="icon"
                            className="h-8 w-8 border-red-500 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50"
                            onClick={handleReject} disabled={isLoading} aria-label="Reject Claim"
                        >
                             {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> <p>Reject</p> </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

// Helper function to render status badge
const renderStatusBadge = (status: ClaimStatus) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    let Icon = Clock;
    if (status === ClaimStatus.APPROVED) { variant = "default"; Icon = CheckCircle; }
    if (status === ClaimStatus.REJECTED) { variant = "destructive"; Icon = XCircle; }
    return <Badge variant={variant} className="capitalize whitespace-nowrap text-xs"><Icon className="mr-1 h-3 w-3"/>{status.toLowerCase()}</Badge>;
};

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-'; // Display dash if no amount
    // TODO: Consider making locale and currency dynamic or configurable
    return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount); // Set to GHS
};


// --- Define Table Columns ---
// Function to generate column definitions dynamically
const getColumns = (
    centerId: string,
    currentUserId: string,
    userRole: Role, // Accept the user's role
    setRowLoading: (rowId: string, isLoading: boolean) => void
): ColumnDef<ClaimForCoordinatorView>[] => [
  {
    accessorKey: "claimType",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Type <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => { // Display claim type with an icon
        const type = row.original.claimType;
        const Icon = type === ClaimType.TEACHING ? BookOpen :
                     type === ClaimType.TRANSPORTATION ? Car :
                     type === ClaimType.THESIS_PROJECT ? GraduationCap : FileText; // Fallback icon
        const formattedType = type.toLowerCase().replace('_', ' ');
        return <div className="flex items-center gap-2 capitalize text-xs font-medium"><Icon className="h-4 w-4 text-muted-foreground flex-shrink-0"/> {formattedType}</div>;
    },
    enableSorting: true,
  },
  {
    // Display relevant detail based on type
    id: "details",
    header: "Details",
    cell: ({ row }) => {
        const claim = row.original;
        let detailText = ''; // Start with empty string

        // Derive detail text based on claim type using fetched fields
        if (claim.claimType === ClaimType.TEACHING && claim.teachingDate) {
            detailText = `Teaching on ${format(claim.teachingDate, "PP")}`;
        } else if (claim.claimType === ClaimType.TRANSPORTATION) {
            detailText = `Transport: ${claim.transportDestinationFrom || '?'} -> ${claim.transportDestinationTo || '?'}`;
        } else if (claim.claimType === ClaimType.THESIS_PROJECT) {
            detailText = claim.thesisType === ThesisType.SUPERVISION ? 'Supervision Claim' :
                         claim.thesisType === ThesisType.EXAMINATION ? `Exam: ${claim.thesisExamCourseCode || '?'}` :
                         'Thesis/Project';
        }
        // Fallback if no specific detail derived
        if (!detailText) detailText = `Claim ID: ${claim.id.substring(0, 8)}...`;

        return <div className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-xs" title={detailText}>{detailText}</div>;
    },
    enableSorting: false, // Sorting on derived details can be complex
  },
  {
    accessorKey: "submittedBy.name", // Access nested property for data
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Submitted By <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => { // Custom cell rendering
        const submitter = row.original.submittedBy;
        // Display name, fallback to email if name is null
        return <div className="text-sm text-muted-foreground truncate" title={submitter.email}>{submitter.name || submitter.email}</div>;
    },
    sortingFn: 'text', // Use basic text sorting
    enableSorting: true,
  },
  {
    // Display relevant amount (only transportAmount is explicitly selected now)
    id: "amount",
    header: ({ column }) => ( // Custom header for sorting, right-aligned
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="justify-end w-full pr-0">
          Amount <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    accessorFn: (row) => row.transportAmount, // Accessor specifically for transportAmount
    cell: ({ row }) => { // Custom cell rendering for currency formatting
        const amount = row.original.transportAmount; // Get the transport amount
        // Right-align currency values
        return <div className="text-right font-mono text-sm whitespace-nowrap">{formatCurrency(amount)}</div>;
    },
    sortingFn: 'basic', // Use basic numerical sorting
    enableSorting: true,
  },
   {
    accessorKey: "status", // Key for status data
    header: "Status", // Simple header text
    cell: ({ row }) => renderStatusBadge(row.getValue("status") as ClaimStatus), // Use helper
     filterFn: (row, id, value) => { // Enable filtering by status (requires filter UI)
       return value.includes(row.getValue(id));
    },
    enableSorting: true, // Allow sorting by status
  },
  {
    accessorKey: "submittedAt", // Key for submission date
    header: ({ column }) => ( // Custom header for sorting
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Submitted <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => { // Custom cell rendering for formatted date with tooltip
        const date = new Date(row.getValue("submittedAt"));
        const formattedDate = format(date, "PP"); // e.g., Sep 21, 2023
        const fullDate = format(date, "PPP p"); // Tooltip date with time
        return (
             <TooltipProvider delayDuration={100}>
                 <Tooltip>
                     <TooltipTrigger className="text-sm text-muted-foreground whitespace-nowrap">{formattedDate}</TooltipTrigger>
                     <TooltipContent> <p>{fullDate}</p> </TooltipContent>
                 </Tooltip>
            </TooltipProvider>
        );
    },
    enableSorting: true, // Allow sorting by date
  },
  {
    id: "actions", // Unique ID for the actions column
    header: () => <div className="text-right">Actions</div>, // Right-aligned header
    cell: ({ row }) => { // Custom cell rendering for action buttons
        const claim = row.original;

        // ** UPDATED: Determine View Details URL based on userRole **
        const viewDetailsUrl = userRole === Role.REGISTRY
            ? `/registry/centers/${centerId}/claims/${claim.id}`
            : `/coordinator/${centerId}/claims/${claim.id}`;

        return (
            <div className="flex justify-end items-center gap-1">
                 {/* View Details Link/Button */}
                 <TooltipProvider delayDuration={100}>
                     <Tooltip>
                         <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                 {/* Link to the specific claim detail page based on role */}
                                 <Link href={viewDetailsUrl} aria-label="View Claim Details">
                                     <Eye className="h-4 w-4" />
                                 </Link>
                             </Button>
                         </TooltipTrigger>
                         <TooltipContent> <p>View Details</p> </TooltipContent>
                     </Tooltip>
                 </TooltipProvider>

                {/* Conditional Approve/Reject Buttons */}
                {/* Pass userRole to the action buttons component */}
                <ClaimActionButtons
                    claim={claim}
                    centerId={centerId}
                    currentUserId={currentUserId}
                    userRole={userRole} // Pass the role down
                    // Pass callbacks to update row loading state
                    onActionStart={() => setRowLoading(row.id, true)}
                    onActionEnd={() => setRowLoading(row.id, false)}
                />
            </div>
        );
    },
    enableSorting: false, // Disable sorting for actions column
  },
];

// --- Main Table Component ---
// Props definition for the main table component
interface ClaimsTableProps {
  centerId: string; // ID of the center these claims belong to
  claims: ClaimForCoordinatorView[]; // Array of claim data using the updated type
  currentUserId: string; // User's ID (Coordinator or Registry)
  userRole: Role; // ** ADDED: Role of the current user viewing the table **
}

export function ClaimsTable({ centerId, claims, currentUserId, userRole }: ClaimsTableProps) {
  // State for managing table sorting
  const [sorting, setSorting] = React.useState<SortingState>([
      // Default sort: PENDING first, then newest submitted first
      { id: 'status', desc: false },
      { id: 'submittedAt', desc: true }
  ]);
  // State for managing column filters (add UI controls later)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  // State to track loading status for individual rows during actions
  const [rowLoadingState, setRowLoadingState] = React.useState<Record<string, boolean>>({});

   // Callback function passed down to action buttons to update row loading state
   const setRowLoading = (rowId: string, isLoading: boolean) => {
     setRowLoadingState(prev => ({ ...prev, [rowId]: isLoading }));
   };

  // Memoize column definitions, passing necessary props and callbacks
  // Regenerates if centerId, currentUserId, or userRole changes
  const columns = React.useMemo(
      () => getColumns(centerId, currentUserId, userRole, setRowLoading),
      [centerId, currentUserId, userRole] // Add userRole to dependencies
  );

  // Initialize the react-table instance
  const table = useReactTable({
    data: claims, // Data for the table
    columns, // Column definitions
    getCoreRowModel: getCoreRowModel(), // Core row model logic
    getPaginationRowModel: getPaginationRowModel(), // Pagination logic
    getSortedRowModel: getSortedRowModel(), // Sorting logic
    getFilteredRowModel: getFilteredRowModel(), // Filtering logic
    onSortingChange: setSorting, // Connect sorting state setter
    onColumnFiltersChange: setColumnFilters, // Connect filtering state setter
    state: { // Pass controlled state to the table
        sorting, // Current sorting configuration
        columnFilters, // Current filter configuration
    },
    initialState: { // Initial table settings
        pagination: { pageSize: 10 }, // Default rows per page
    },
  });

  // Render the table structure
  return (
    <div className="w-full space-y-3"> {/* Container with vertical spacing */}
        {/* Optional: Add Filters UI here later */}

        {/* Table container with border */}
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* Map over header groups to render table headers */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {/* Render header content using flexRender helper */}
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Check if there are rows to display */}
            {table.getRowModel().rows?.length ? (
              // Map over the rows provided by the table model for the current page
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  // Apply visual state if the row is currently loading (optional)
                  data-state={rowLoadingState[row.id] ? 'loading' : row.getIsSelected() ? "selected" : undefined}
                  // Dim the row slightly if it's loading (optional)
                  className={rowLoadingState[row.id] ? 'opacity-60 transition-opacity' : ''}
                >
                  {/* Map over the visible cells for the current row */}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2 px-3 md:px-4"> {/* Adjust padding */}
                        {/* Render cell content using flexRender helper */}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Display a message if the table is empty
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No claims found for this center.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination Controls */}
       <div className="flex items-center justify-end space-x-2 pt-2">
        <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()} // Disable if on the first page
        >
          Previous
        </Button>
        {/* Next Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()} // Disable if on the last page
        >
          Next
        </Button>
      </div>
    </div>
  );
}
