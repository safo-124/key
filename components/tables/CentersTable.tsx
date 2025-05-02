"use client";

import * as React from "react";
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

import type { CenterWithCoordinator } from "@/app/(protected)/registry/centers/page";

export const columns: ColumnDef<CenterWithCoordinator>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Center Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const center = row.original;
        const centerClaimsUrl = `/registry/centers/${center.id}/claims`;

        return (
            <Link 
              href={centerClaimsUrl} 
              className="font-medium text-gray-900 hover:text-gray-600 hover:underline transition-colors"
            >
              {center.name}
            </Link>
        );
    },
  },
  {
    accessorKey: "coordinator",
    header: "Coordinator",
    cell: ({ row }) => {
      const coordinator = row.original.coordinator;
      if (!coordinator) {
        return <Badge variant="outline" className="border-gray-300 text-gray-600">Not Assigned</Badge>;
      }
      return (
        <div>
          <div className="text-gray-800">{coordinator.name || 'N/A'}</div>
          <div className="text-xs text-gray-500">{coordinator.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString('en-US', {
         year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div className="text-gray-700">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const center = row.original;
      const centerClaimsUrl = `/registry/centers/${center.id}/claims`;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border border-gray-200 shadow-lg">
            <DropdownMenuLabel className="text-gray-700 font-medium">Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                 <Link href={centerClaimsUrl} className="flex items-center cursor-pointer text-gray-700 hover:bg-gray-100">
                    <Eye className="mr-2 h-4 w-4 text-gray-500" /> View Claims
                 </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => navigator.clipboard.writeText(center.id)}
            >
              Copy Center ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem className="text-gray-500 hover:bg-gray-100" disabled>
              Edit Center (TBD)
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-500 hover:bg-gray-100" disabled>
                Delete Center (TBD)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface CentersTableProps {
  data: CenterWithCoordinator[];
}

export function CentersTable({ data }: CentersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
        pagination: {
            pageSize: 10,
        },
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
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
          <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap"
                    >
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
                  className="h-24 text-center text-gray-500"
                >
                  No centers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}