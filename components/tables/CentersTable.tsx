"use client"; // This component uses hooks, so it's a Client Component

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel, // Import pagination model
  getSortedRowModel,      // Import sorting model
  SortingState,           // Import sorting state type
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react"; // Icons

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // To display coordinator status

// Import the type definition from the page component
import type { CenterWithCoordinator } from "@/app/(protected)/registry/centers/page";

// Define the columns for the table
export const columns: ColumnDef<CenterWithCoordinator>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => { // Add sorting button to header
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Center Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "coordinator",
    header: "Coordinator",
    cell: ({ row }) => {
      const coordinator = row.original.coordinator; // Access the full coordinator object
      if (!coordinator) {
        return <Badge variant="destructive">Not Assigned</Badge>;
      }
      // Display name and email
      return (
        <div>
          <div>{coordinator.name || 'N/A'}</div>
          <div className="text-xs text-muted-foreground">{coordinator.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => { // Add sorting button to header
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      // Format date for better readability
      const formattedDate = date.toLocaleDateString('en-US', {
         year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions", // Unique ID for the actions column
    cell: ({ row }) => {
      const center = row.original; // Get the full center data for this row

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(center.id)}
            >
              Copy Center ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* TODO: Implement View/Edit/Delete functionality */}
            <DropdownMenuItem disabled>View Details (TBD)</DropdownMenuItem>
            <DropdownMenuItem disabled>Edit Center (TBD)</DropdownMenuItem>
            <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                Delete Center (TBD)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Interface for the component props
interface CentersTableProps {
  data: CenterWithCoordinator[];
}

export function CentersTable({ data }: CentersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]); // State for sorting

  // Initialize the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    getSortedRowModel: getSortedRowModel(),       // Enable sorting
    onSortingChange: setSorting,                // Connect sorting state
    state: {
      sorting,                                  // Pass sorting state
    },
    initialState: {                             // Set initial pagination state
        pagination: {
            pageSize: 10, // Show 10 rows per page
        },
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Table Rendering */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No centers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination Controls */}
       <div className="flex items-center justify-end space-x-2 py-4">
         <Button
           variant="outline"
           size="sm"
           onClick={() => table.previousPage()}
           disabled={!table.getCanPreviousPage()}
         >
           Previous
         </Button>
         <Button
           variant="outline"
           size="sm"
           onClick={() => table.nextPage()}
           disabled={!table.getCanNextPage()}
         >
           Next
         </Button>
       </div>
    </div>
  );
}
