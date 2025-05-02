"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Search, ChevronLeft, ChevronRight, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { UserWithAssignment } from "@/app/(protected)/registry/users/page";
import { Role } from "@prisma/client";

const formatAssignment = (user: UserWithAssignment): React.ReactNode => {
  if (user.role === Role.COORDINATOR && user.coordinatedCenter) {
    return (
      <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-200">
        <span className="font-medium">Coordinator</span>: {user.coordinatedCenter.name}
      </Badge>
    );
  }
  if (user.role === Role.LECTURER && user.lecturerCenter) {
    const dept = user.department ? ` (${user.department.name})` : '';
    return (
      <Badge variant="secondary" className="bg-purple-50/50 text-purple-600 border-purple-200">
        <span className="font-medium">Lecturer</span>: {user.lecturerCenter.name}{dept}
      </Badge>
    );
  }
  if (user.role === Role.REGISTRY) {
    return <Badge className="bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-sm">System Administrator</Badge>;
  }
  return <span className="text-sm text-muted-foreground">Not assigned</span>;
};

export const columns: ColumnDef<UserWithAssignment>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent font-medium text-gray-700 group"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.getValue("name") || 'Unnamed User'}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent font-medium text-gray-700 group"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-gray-600">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Role;
      const variants = {
        [Role.REGISTRY]: "bg-gradient-to-r from-gray-700 to-gray-800 text-white",
        [Role.COORDINATOR]: "bg-blue-100/50 text-blue-700",
        [Role.LECTURER]: "bg-purple-100/50 text-purple-700",
      };
      return (
        <Badge className={`${variants[role]} border-0 font-medium`}>
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "assignment",
    header: "Assignment",
    cell: ({ row }) => formatAssignment(row.original),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent font-medium text-gray-700 group"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Member Since
        <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      return <div className="text-sm text-gray-500">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100/50"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-lg shadow-md border border-gray-200"
          >
            <DropdownMenuLabel className="font-medium text-gray-800">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
              className="text-gray-700 hover:bg-gray-100/50 cursor-pointer"
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100/50 cursor-pointer">
              <Link href={`/registry/users/${user.id}`} className="w-full">
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              disabled={user.role === Role.REGISTRY}
              className={`${
                user.role !== Role.REGISTRY
                  ? "text-red-600 hover:bg-red-50/50 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Deactivate User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface UsersTableProps {
  data: UserWithAssignment[];
}

export function UsersTable({ data }: UsersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
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
    <div className="w-full space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="pl-10 w-full bg-gray-50/50 border-gray-200"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full bg-gray-50/50 border-gray-200">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent className="border-gray-200">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={Role.REGISTRY}>Administrators</SelectItem>
              <SelectItem value={Role.COORDINATOR}>Coordinators</SelectItem>
              <SelectItem value={Role.LECTURER}>Lecturers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3.5 border-b border-gray-200"
                  >
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
                  className="border-b border-gray-100 hover:bg-gray-50/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
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
                  className="h-24 text-center text-gray-500 py-8"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Users className="h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{' '}
          <span className="font-medium">{data.length}</span> users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-gray-200 text-gray-700 hover:bg-gray-50/50 h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <div className="text-sm text-gray-500 px-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-gray-200 text-gray-700 hover:bg-gray-50/50 h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}