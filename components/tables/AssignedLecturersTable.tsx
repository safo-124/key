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
} from "@tanstack/react-table";
import { Loader2, UserX, ArrowUpDown, Building2 } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { unassignLecturerFromCenter } from "@/lib/actions/registry.actions";

export type AssignedLecturer = {
  id: string;
  name: string | null;
  email: string;
  department?: {
    id: string;
    name: string;
  } | null;
};

interface RemoveLecturerButtonProps {
  centerId: string;
  lecturer: AssignedLecturer;
  onRemoveStart: () => void;
  onRemoveEnd: () => void;
}

function RemoveLecturerButton({ centerId, lecturer, onRemoveStart, onRemoveEnd }: RemoveLecturerButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    onRemoveStart();
    
    try {
      const result = await unassignLecturerFromCenter({ centerId, lecturerId: lecturer.id });
      if (result.success) {
        toast.success(result.message || "Lecturer removed successfully.");
        setIsDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to remove lecturer.");
      }
    } catch (error) {
      console.error("Remove lecturer error:", error);
      toast.error("An unexpected error occurred during removal.");
    } finally {
      setIsRemoving(false);
      onRemoveEnd();
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-8 h-8 p-0"
          disabled={isRemoving}
          aria-label={`Remove ${lecturer.name || lecturer.email}`}
        >
          {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove <span className="font-semibold">{lecturer.name || lecturer.email}</span> from this center.
            They will need to be reassigned to access center resources.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : "Remove Lecturer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const getColumns = (
  centerId: string,
  showActions: boolean,
  setRowLoading: (rowId: string, isLoading: boolean) => void
): ColumnDef<AssignedLecturer>[] => {
  const columns: ColumnDef<AssignedLecturer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name || <span className="text-muted-foreground">Unnamed</span>}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-sm">{row.original.email}</div>,
    },
    {
      accessorKey: "department.name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Department
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const departmentName = row.original.department?.name;
        return departmentName ? (
          <Badge variant="secondary" className="font-normal">
            <Building2 className="mr-1.5 h-3 w-3" />
            {departmentName}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Not assigned</span>
        );
      },
      sortingFn: 'text',
    },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Manage</div>,
      cell: ({ row }) => {
        const lecturer = row.original;
        return (
          <div className="flex justify-end">
            <RemoveLecturerButton
              centerId={centerId}
              lecturer={lecturer}
              onRemoveStart={() => setRowLoading(row.id, true)}
              onRemoveEnd={() => setRowLoading(row.id, false)}
            />
          </div>
        );
      },
    });
  }

  return columns;
};

interface AssignedLecturersTableProps {
  centerId: string;
  assignedLecturers: AssignedLecturer[];
  showActions?: boolean;
  isLoading?: boolean;
}

export function AssignedLecturersTable({
  centerId,
  assignedLecturers,
  showActions = true,
  isLoading = false,
}: AssignedLecturersTableProps) {
  const [rowLoadingState, setRowLoadingState] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const setRowLoading = (rowId: string, isLoading: boolean) => {
    setRowLoadingState(prev => ({ ...prev, [rowId]: isLoading }));
  };

  const columns = React.useMemo(
    () => getColumns(centerId, showActions, setRowLoading),
    [centerId, showActions]
  );

  const table = useReactTable({
    data: assignedLecturers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: showActions ? 4 : 3 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: showActions ? 4 : 3 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                  data-state={rowLoadingState[row.id] ? 'loading' : undefined}
                  className={rowLoadingState[row.id] ? 'opacity-70' : ''}
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No lecturers assigned to this center yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex space-x-2">
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
      )}
    </div>
  );
}