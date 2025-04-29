"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Import filtering model
  SortingState,
  ColumnFiltersState, // Import filter state type
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For filtering
import { Badge } from "@/components/ui/badge"; // To display roles and assignments
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

// Import the type definition from the page component
import type { UserWithAssignment } from "@/app/(protected)/registry/users/page";
import { Role } from "@prisma/client"; // Import Role enum

// Helper function to format assignment details
const formatAssignment = (user: UserWithAssignment): React.ReactNode => {
    if (user.role === Role.COORDINATOR && user.coordinatedCenter) {
        return <Badge variant="outline">Coord: {user.coordinatedCenter.name}</Badge>;
    }
    if (user.role === Role.LECTURER && user.lecturerCenter) {
        const dept = user.department ? ` / Dept: ${user.department.name}` : '';
        return <Badge variant="secondary">Center: {user.lecturerCenter.name}{dept}</Badge>;
    }
     if (user.role === Role.REGISTRY) {
        return <Badge variant="default">System Admin</Badge>;
    }
    return <span className="text-xs text-muted-foreground">N/A</span>;
};

// Define the columns for the table
export const columns: ColumnDef<UserWithAssignment>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name") || 'N/A'}</div>,
  },
  {
    accessorKey: "email",
     header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.getValue("role") as Role;
        let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
        if (role === Role.REGISTRY) variant = "default";
        if (role === Role.COORDINATOR) variant = "secondary";
        return <Badge variant={variant}>{role}</Badge>;
    },
     // Add filter function for role
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "assignment", // Custom ID for this column
    header: "Assignment",
    cell: ({ row }) => formatAssignment(row.original), // Use helper function
  },
   {
    accessorKey: "createdAt",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* TODO: Implement View/Edit/Delete functionality */}
            <DropdownMenuItem disabled>View Details (TBD)</DropdownMenuItem>
            <DropdownMenuItem disabled>Edit Role (TBD)</DropdownMenuItem>
            {/* Prevent deleting own account or other registry admins easily */}
            <DropdownMenuItem
                disabled={user.role === Role.REGISTRY}
                className={user.role !== Role.REGISTRY ? "text-destructive focus:text-destructive focus:bg-destructive/10" : ""}
            >
                Delete User (TBD)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Interface for the component props
interface UsersTableProps {
  data: UserWithAssignment[];
}

export function UsersTable({ data }: UsersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]); // State for filters

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters, // Connect filter state
    state: {
      sorting,
      columnFilters, // Pass filter state
    },
     initialState: {
        pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="w-full space-y-4">
       {/* Filter Input */}
        <div className="flex items-center py-4">
            <Input
            placeholder="Filter by email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            {/* TODO: Add filtering by Role using a Select dropdown */}
        </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination */}
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
