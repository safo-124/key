"use client"; // Mark as Client Component due to hooks and interactions

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
import { ArrowUpDown, CheckCircle, XCircle, Clock, MoreHorizontal } from "lucide-react"; // Icons
import { format } from 'date-fns'; // For formatting dates

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // For status display
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
   Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"; // For showing full dates on hover
import { ClaimStatus } from "@prisma/client"; // Import ClaimStatus enum

// Import type definition from the page component
import type { LecturerClaim } from "@/app/(protected)/lecturer/[centerId]/claims/page";

// --- Define table columns ---
// Function to generate column definitions
const columns: ColumnDef<LecturerClaim>[] = [
  {
    accessorKey: "title", // Key in the data object
    header: ({ column }) => ( // Custom header for sorting
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className="font-medium truncate max-w-[250px] md:max-w-xs" title={row.getValue("title")}>{row.getValue("title")}</div>, // Truncate long titles
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
    accessorKey: "processedAt", // Key for processing date
    header: ({ column }) => ( // Custom header for sorting
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Processed <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => { // Custom cell rendering for formatted date with tooltip
        const dateValue = row.getValue("processedAt");
        if (!dateValue) return <span className="text-xs text-muted-foreground">-</span>; // Display dash if not processed

        const date = new Date(dateValue as string); // Cast to string before Date constructor
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
    cell: ({ row }) => {
      const claim = row.original;
      // Placeholder for potential future actions like View Details
      // Or editing/deleting if status is PENDING
      return (
        <div className="text-right">
            {/* Example: View Details Button (currently disabled) */}
            {/* <Button variant="ghost" size="icon" className="h-8 w-8" disabled title="View Details (TBD)">
                <MoreHorizontal className="h-4 w-4" />
            </Button> */}
        </div>
      );
    },
    enableSorting: false,
  },
];

// --- Main Table Component ---
// Props definition for the main table component
interface LecturerClaimsTableProps {
  claims: LecturerClaim[]; // Array of claim data specific to the lecturer
}

export function LecturerClaimsTable({ claims }: LecturerClaimsTableProps) {
  // State for managing table sorting
  const [sorting, setSorting] = React.useState<SortingState>([
      // Default sort: newest submitted first
      { id: 'submittedAt', desc: true }
  ]);
  // State for managing column filters (add UI controls later)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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
       {/* TODO: Add Filters UI (e.g., Status Dropdown) */}
       {/* Example Filter:
       <div className="flex items-center py-4">
            <Input
                placeholder="Filter by title..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
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
                  data-state={row.getIsSelected() && "selected"} // Apply selected state styling if needed
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
                  You have not submitted any claims for this center yet.
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
