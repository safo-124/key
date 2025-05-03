"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2, UserPlus, Users, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Role } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import {
    updateDepartment,
    deleteDepartment,
    assignLecturerToDepartment,
    unassignLecturerFromDepartment
} from "@/lib/actions/coordinator.actions";

import type { DepartmentWithLecturerCount } from "@/app/(protected)/coordinator/[centerId]/departments/page";
type LecturerForAssignment = {
    id: string;
    name: string | null;
    email: string;
    departmentId: string | null;
};

function AssignLecturersDialog({ centerId, department, onAssignmentComplete }: {
    centerId: string;
    department: DepartmentWithLecturerCount;
    onAssignmentComplete: () => void;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [lecturers, setLecturers] = React.useState<LecturerForAssignment[]>([]);
    const [assignedIds, setAssignedIds] = React.useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (!isOpen) return;

        const fetchLecturers = async () => {
            setIsLoading(true);
            setLecturers([]);
            setAssignedIds(new Set());

            try {
                await new Promise(resolve => setTimeout(resolve, 700));
                const fetchedLecturers: LecturerForAssignment[] = [];
                setLecturers(fetchedLecturers);
                const currentAssigned = new Set(
                    fetchedLecturers.filter(l => l.departmentId === department.id).map(l => l.id)
                );
                setAssignedIds(currentAssigned);
            } catch (error) {
                console.error("Failed to fetch lecturers:", error);
                toast.error("Could not load lecturers list.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLecturers();
    }, [isOpen, centerId, department.id]);

    const handleCheckboxChange = (lecturerId: string, checked: boolean | 'indeterminate') => {
        setAssignedIds(prev => {
            const newSet = new Set(prev);
            if (checked === true) {
                newSet.add(lecturerId);
            } else {
                newSet.delete(lecturerId);
            }
            return newSet;
        });
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const assignmentsToMake = lecturers.filter(l => assignedIds.has(l.id) && l.departmentId !== department.id);
        const unassignmentsToMake = lecturers.filter(l => !assignedIds.has(l.id) && l.departmentId === department.id);

        const results = await Promise.allSettled([
            ...assignmentsToMake.map(lecturer =>
                assignLecturerToDepartment({ centerId, departmentId: department.id, lecturerId: lecturer.id })
            ),
            ...unassignmentsToMake.map(lecturer =>
                 unassignLecturerFromDepartment({ centerId, lecturerId: lecturer.id })
            )
        ]);

        let allSucceeded = true;
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                allSucceeded = false;
                console.error(`Assignment Error [${index}]:`, result.reason);
                toast.error(`Error updating assignment: ${(result.reason as any)?.message || "An error occurred"}`);
            } else if (result.value.success === false) {
                 allSucceeded = false;
                 toast.error(result.value.message || "An error occurred");
            }
        });

        if (allSucceeded) {
            toast.success("Lecturer assignments updated successfully.");
            onAssignmentComplete();
            setIsOpen(false);
        } else {
             onAssignmentComplete();
        }

        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-red-50 hover:from-blue-100 hover:to-red-100 border border-blue-200/50 text-blue-700 hover:text-blue-800">
                    <Users className="mr-2 h-4 w-4" /> Assign Lecturers
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white to-red-50 border border-blue-200/50">
                <DialogHeader>
                    <DialogTitle className="bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                        Assign Lecturers to: {department.name}
                    </DialogTitle>
                    <DialogDescription className="text-blue-700/80">
                        Select lecturers from this center to assign them to this department.
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="max-h-[40vh] overflow-y-auto space-y-2 p-1 border border-blue-200/30 rounded-md bg-white/50">
                        {lecturers.length > 0 ? lecturers.map(lecturer => (
                            <div key={lecturer.id} className="flex items-center space-x-3 p-2 hover:bg-blue-50/50 rounded">
                                <Checkbox
                                    id={`lecturer-${lecturer.id}-${department.id}`}
                                    checked={assignedIds.has(lecturer.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(lecturer.id, checked)}
                                    disabled={isSaving}
                                    className="border-blue-300 data-[state=checked]:bg-blue-500"
                                />
                                <label
                                    htmlFor={`lecturer-${lecturer.id}-${department.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 text-blue-800"
                                >
                                    {lecturer.name || 'N/A'} <span className="text-xs text-blue-600/70">({lecturer.email})</span>
                                </label>
                            </div>
                        )) : <p className="text-sm text-blue-600/70 text-center py-4">No lecturers found in this center to assign.</p>}
                    </div>
                )}
                <DialogFooter>
                     <DialogClose asChild>
                         <Button type="button" variant="outline" disabled={isSaving} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                             Cancel
                         </Button>
                     </DialogClose>
                    <Button
                        type="button"
                        onClick={handleSaveChanges}
                        disabled={isLoading || isSaving || lecturers.length === 0}
                        className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white"
                    >
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditDepartmentName({ department, onSave }: {
    department: DepartmentWithLecturerCount;
    onSave: () => void;
}) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [newName, setNewName] = React.useState(department.name);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSave = async () => {
        if (newName === department.name || newName.trim().length < 2) {
            setIsEditing(false);
            setNewName(department.name);
            if (newName !== department.name) {
                 toast.warning("Department name must be at least 2 characters.");
            }
            return;
        }
        setIsLoading(true);
        try {
            const result = await updateDepartment({ departmentId: department.id, name: newName.trim(), centerId: department.centerId });
            if (result.success) {
                toast.success(result.message || "Department updated.");
                onSave();
                setIsEditing(false);
            } else {
                toast.error(result.message || "Failed to update department.");
                setNewName(department.name);
            }
        } catch (e) {
            toast.error("An unexpected error occurred while updating.");
            setNewName(department.name);
        }
        finally {
            setIsLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-sm border-blue-300 focus:ring-blue-500"
                    disabled={isLoading}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } else if (e.key === 'Escape') { setIsEditing(false); setNewName(department.name) } }}
                    autoFocus
                />
                <Button size="sm" onClick={handleSave} disabled={isLoading || newName.trim() === department.name || newName.trim().length < 2} className="h-8 px-2 bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setNewName(department.name); }} disabled={isLoading} className="h-8 px-2 text-blue-700 hover:bg-blue-50">
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 group min-h-[32px]">
            <span className="text-sm font-medium text-blue-800">{department.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100" onClick={() => setIsEditing(true)}>
                <Pencil className="h-3 w-3 text-blue-600" />
            </Button>
        </div>
    );
}

const getColumns = (
    centerId: string,
    refreshData: () => void
): ColumnDef<DepartmentWithLecturerCount>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-blue-700 hover:bg-blue-50">
          Department Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <EditDepartmentName department={row.original} onSave={refreshData} />,
    enableSorting: true,
  },
  {
    accessorKey: "_count.lecturers",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-blue-700 hover:bg-blue-50">
            Lecturers <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
        <div className="text-center">
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-red-50 border-blue-200 text-blue-700">
                {row.original._count.lecturers}
            </Badge>
        </div>
    ),
    enableSorting: true,
  },
  {
    id: "assign",
    header: () => <div className="text-center text-blue-700">Assign Lecturers</div>,
    cell: ({ row }) => (
        <div className="text-center">
            <AssignLecturersDialog
                centerId={centerId}
                department={row.original}
                onAssignmentComplete={refreshData}
            />
        </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right text-blue-700">Actions</div>,
    cell: ({ row }) => {
        const department = row.original;
        const [isDeleting, setIsDeleting] = React.useState(false);

        const handleDelete = async () => {
            setIsDeleting(true);
            try {
                const result = await deleteDepartment({ departmentId: department.id, centerId: centerId });
                if (result.success) {
                    toast.success(result.message || "Department deleted.");
                    refreshData();
                } else {
                    toast.error(result.message || "Failed to delete department.");
                }
            } catch (e) {
                toast.error("An unexpected error occurred while deleting.");
            } finally {
                setIsDeleting(false);
            }
        };

      return (
          <div className="text-right">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50/50"
                        disabled={isDeleting}
                        aria-label={`Delete department ${department.name}`}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-to-br from-white to-red-50 border border-red-200/50">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                            Delete Department?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-blue-800/80">
                            Are you sure you want to delete the department "{department.name}"?
                            This will unassign all lecturers currently in this department. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
      );
    },
    enableSorting: false,
  },
];

interface DepartmentsTableProps {
  centerId: string;
  departments: DepartmentWithLecturerCount[];
}

export function DepartmentsTable({ centerId, departments }: DepartmentsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();

  const refreshData = () => {
      router.refresh();
  };

  const columns = React.useMemo(() => getColumns(centerId, refreshData), [centerId]);

  const table = useReactTable({
    data: departments,
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

  return (
    <div className="w-full space-y-3">
      <div className="rounded-xl border border-blue-200/50 bg-white shadow-sm overflow-hidden">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="bg-gradient-to-r from-blue-50 to-red-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border-b border-blue-200/50 first:pl-6 last:pr-6 py-3">
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
                  className="hover:bg-blue-50/30 border-b border-blue-100/50 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:pl-6 last:pr-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-blue-800/50">
                  No departments have been created for this center yet.
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
           className="border-blue-200 text-blue-700 hover:bg-blue-50"
         >
           Previous
         </Button>
         <Button
           variant="outline"
           size="sm"
           onClick={() => table.nextPage()}
           disabled={!table.getCanNextPage()}
           className="border-blue-200 text-blue-700 hover:bg-blue-50"
         >
           Next
         </Button>
       </div>
    </div>
  );
}