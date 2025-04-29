"use client"; // Mark as Client Component due to hooks and event handlers

import * as React from "react";
import {
  ColumnDef, // Type for defining table columns
  flexRender, // Helper for rendering components in cells/headers
  getCoreRowModel, // Core table logic
  useReactTable, // Hook to create table instance
  getPaginationRowModel, // Enables pagination
  getSortedRowModel, // Enables sorting
  getFilteredRowModel, // Enables filtering
  SortingState, // Type for sorting state
  ColumnFiltersState // Type for filtering state
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, Clock, Loader2, FileText } from "lucide-react"; // Icons
import { useRouter } from 'next/navigation'; // Hook for refreshing data
import { format } from 'date-fns'; // For formatting dates

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
import { ClaimStatus } from "@prisma/client"; // Import ClaimStatus enum

// Import type definition from the page component
import type { ClaimWithSubmitter } from "@/app/(protected)/coordinator/[centerId]/claims/page";
// Import server actions for approving/rejecting claims
import { approveClaim, rejectClaim } from "@/lib/actions/coordinator.actions";

// --- Helper Sub-Component: Action Buttons ---
// This component renders Approve/Reject buttons for a specific claim
interface ClaimActionButtonsProps {
    claim: ClaimWithSubmitter;
    centerId: string;
    currentUserId: string; // Coordinator's ID (needed for action payload)
    onActionStart: () => void; // Callback when an action starts
    onActionEnd: () => void;   // Callback when an action finishes
}

function ClaimActionButtons({ claim, centerId, currentUserId, onActionStart, onActionEnd }: ClaimActionButtonsProps) {
    const router = useRouter(); // Hook to refresh page data
    const [isApproving, setIsApproving] = React.useState(false); // Loading state for approve button
    const [isRejecting, setIsRejecting] = React.useState(false); // Loading state for reject button
    const isLoading = isApproving || isRejecting; // Combined loading state

    // Handler for the Approve action
    const handleApprove = async () => {
        setIsApproving(true);
        onActionStart(); // Notify parent row that action started
        try {
            // Call the server action
            const result = await approveClaim({ claimId: claim.id, centerId, coordinatorId: currentUserId });
            if (result.success) {
                toast.success(result.message || "Claim approved successfully.");
                router.refresh(); // Refresh server data on success
            } else {
                toast.error(result.message || "Failed to approve claim.");
            }
        } catch (e) {
            console.error("Client error approving claim:", e);
            toast.error("An unexpected error occurred while approving.");
        } finally {
            setIsApproving(false);
            onActionEnd(); // Notify parent row that action ended
        }
    };

    // Handler for the Reject action
    const handleReject = async () => {
        setIsRejecting(true);
        onActionStart(); // Notify parent row
         try {
            // Call the server action
            const result = await rejectClaim({ claimId: claim.id, centerId, coordinatorId: currentUserId });
            if (result.success) {
                toast.success(result.message || "Claim rejected successfully.");
                router.refresh(); // Refresh server data on success
            } else {
                toast.error(result.message || "Failed to reject claim.");
            }
        } catch (e) {
            console.error("Client error rejecting claim:", e);
            toast.error("An unexpected error occurred while rejecting.");
        } finally {
            setIsRejecting(false);
            onActionEnd(); // Notify parent row
        }
    };

    // Only render action buttons if the claim status is PENDING
    if (claim.status !== ClaimStatus.PENDING) {
        // Optionally return a 'View Details' button or null for processed claims
        return (
            <div className="flex items-center justify-end space-x-2">
                {/* Placeholder for potential View Details button */}
                {/* <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View Details"><MoreHorizontal className="h-4 w-4" /></Button> */}
            </div>
        );
    }

    // Render Approve and Reject buttons
    return (
        <div className="flex items-center justify-end space-x-1 md:space-x-2"> {/* Reduced spacing on small screens */}
            <TooltipProvider delayDuration={100}>
                {/* Approve Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-green-500 text-green-600 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/50"
                            onClick={handleApprove}
                            disabled={isLoading} // Disable both buttons if either action is loading
                            aria-label="Approve Claim"
                        >
                            {/* Show loader or icon */}
                            {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> <p>Approve</p> </TooltipContent>
                </Tooltip>
                {/* Reject Button */}
                 <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-red-500 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50"
                            onClick={handleReject}
                            disabled={isLoading} // Disable both buttons if either action is loading
                            aria-label="Reject Claim"
                        >
                             {/* Show loader or icon */}
                             {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> <p>Reject</p> </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* TODO: Add View Details Button/Modal trigger here */}
             {/* <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View Details"><MoreHorizontal className="h-4 w-4" /></Button> */}
        </div>
    );
}


// --- Define Table Columns ---
// Function to generate column definitions
const getColumns = (
    centerId: string, // Center ID for actions
    currentUserId: string, // Coordinator's ID for actions
    setRowLoading: (rowId: string, isLoading: boolean) => void // Callback to manage row loading state
): ColumnDef<ClaimWithSubmitter>[] => [
  {
    accessorKey: "title", // Key in the data object
    header: ({ column }) => ( // Custom header for sorting
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className="font-medium truncate max-w-[200px] md:max-w-[300px]" title={row.getValue("title")}>{row.getValue("title")}</div>, // Truncate long titles
    enableSorting: true,
  },
  {
    accessorKey: "submittedBy.name", // Access nested property for data
    header: ({ column }) => ( // Custom header for sorting
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Submitted By <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => { // Custom cell rendering
        const submitter = row.original.submittedBy;
        // Display name, fallback to email if name is null
        return <div className="text-sm text-muted-foreground">{submitter.name || submitter.email}</div>;
    },
     sortingFn: 'text', // Use basic text sorting
     enableSorting: true,
  },
  {
    accessorKey: "amount", // Key for amount data
     header: ({ column }) => ( // Custom header for sorting, right-aligned
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="justify-end w-full">
          Amount <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => { // Custom cell rendering for currency formatting
        const amount = parseFloat(row.getValue("amount"));
        // Format as currency (adjust locale/currency as needed)
        const formatted = new Intl.NumberFormat("en-US", { // TODO: Make locale/currency configurable if needed
            style: "currency",
            currency: "USD", // Change currency code if necessary
        }).format(amount);
        // Right-align currency values
        return <div className="text-right font-mono whitespace-nowrap">{formatted}</div>;
    },
    sortingFn: 'basic', // Use basic numerical sorting
    enableSorting: true,
  },
   {
    accessorKey: "status", // Key for status data
    header: "Status", // Simple header text
    cell: ({ row }) => { // Custom cell rendering for status badge
        const status = row.getValue("status") as ClaimStatus;
        let variant: "default" | "secondary" | "outline" | "destructive" = "outline"; // Default variant
        let Icon = Clock; // Default icon
        // Determine badge variant and icon based on status
        if (status === ClaimStatus.APPROVED) { variant = "default"; Icon = CheckCircle; }
        if (status === ClaimStatus.REJECTED) { variant = "destructive"; Icon = XCircle; }
        // Render the badge with icon and capitalized text
        return <Badge variant={variant} className="capitalize whitespace-nowrap"><Icon className="mr-1 h-3 w-3"/>{status.toLowerCase()}</Badge>;
    },
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
            // Use Tooltip for showing full date/time on hover
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
        // Render the action buttons component
        return (
             <ClaimActionButtons
                claim={claim}
                centerId={centerId}
                currentUserId={currentUserId}
                // Pass callbacks to update row loading state
                onActionStart={() => setRowLoading(row.id, true)}
                onActionEnd={() => setRowLoading(row.id, false)}
             />
        );
    },
    enableSorting: false, // Disable sorting for actions column
  },
];

// --- Main Table Component ---
// Props definition for the main table component
interface ClaimsTableProps {
  centerId: string; // ID of the center these claims belong to
  claims: ClaimWithSubmitter[]; // Array of claim data
  currentUserId: string; // Coordinator's user ID (needed for actions)
}

export function ClaimsTable({ centerId, claims, currentUserId }: ClaimsTableProps) {
  // State for managing table sorting
  const [sorting, setSorting] = React.useState<SortingState>([
      // Default sort: PENDING first, then newest first
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
  const columns = React.useMemo(() => getColumns(centerId, currentUserId, setRowLoading), [centerId, currentUserId]);

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
       {/* TODO: Add Filters UI (e.g., Status Dropdown, Submitter Search) */}
       {/* Example Filter:
       <div className="flex items-center py-4">
            <Input
                placeholder="Filter by submitter email..."
                value={(table.getColumn("submittedBy.name")?.getFilterValue() as string) ?? ""} // Adjust column accessor if filtering email
                onChange={(event) => table.getColumn("submittedBy.name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
       </div>
       */}

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
