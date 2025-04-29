"use client"; // Mark as Client Component due to hooks and interactions

import * as React from "react";
import {
  ColumnDef, // Type for defining table columns
  flexRender, // Helper for rendering components in cells/headers
  getCoreRowModel, // Core table logic
  useReactTable, // Hook to create table instance
  getPaginationRowModel, // Enables pagination
  getSortedRowModel, // Enables sorting
  SortingState // Type for sorting state
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2, UserPlus, Users, Loader2 } from "lucide-react"; // Icons
import { useRouter } from 'next/navigation'; // Hook for refreshing data
import { Role } from "@prisma/client"; // Import Role enum

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For inline edit
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"; // Not strictly used in final version, but could be an alternative actions menu
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // For delete confirmation
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"; // For Assign Lecturers modal
import { Checkbox } from "@/components/ui/checkbox"; // For Assign Lecturers modal list
import { Skeleton } from "@/components/ui/skeleton"; // For loading state in dialog
import { toast } from "sonner"; // For notifications

// Import server actions
import {
    updateDepartment,
    deleteDepartment,
    assignLecturerToDepartment,
    unassignLecturerFromDepartment
} from "@/lib/actions/coordinator.actions";

// Import type definitions from page components
import type { DepartmentWithLecturerCount } from "@/app/(protected)/coordinator/[centerId]/departments/page";
// Define lecturer type needed for the assignment dialog
type LecturerForAssignment = {
    id: string;
    name: string | null;
    email: string;
    departmentId: string | null; // Needed to check current assignment
};


// --- Helper Component: Assign Lecturers Dialog ---
interface AssignLecturersDialogProps {
    centerId: string;
    department: DepartmentWithLecturerCount;
    onAssignmentComplete: () => void; // Callback to refresh data after changes
}

function AssignLecturersDialog({ centerId, department, onAssignmentComplete }: AssignLecturersDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true); // Loading state for fetching lecturers
    const [lecturers, setLecturers] = React.useState<LecturerForAssignment[]>([]); // List of lecturers in the center
    const [assignedIds, setAssignedIds] = React.useState<Set<string>>(new Set()); // Set of IDs assigned to *this* department
    const [isSaving, setIsSaving] = React.useState(false); // Loading state for saving changes

    // Fetch lecturers for the center when the dialog opens
    React.useEffect(() => {
        if (!isOpen) return; // Only fetch when dialog is open

        const fetchLecturers = async () => {
            setIsLoading(true);
            setLecturers([]); // Clear previous list
            setAssignedIds(new Set()); // Clear previous assignments

            try {
                // --- !!! IMPORTANT NOTE !!! ---
                // Direct DB access or complex logic in Client Components is discouraged.
                // Ideally, create a Server Action `getLecturersForCenter(centerId)`
                // or an API route `/api/centers/[centerId]/lecturers` to fetch this data securely.
                // This example uses a placeholder fetch simulation. Replace with your actual data fetching method.

                // Placeholder: Simulate fetching lecturers for the center
                console.log(`AssignLecturersDialog: Fetching lecturers for center ${centerId}`);
                // Replace with actual fetch call:
                // const response = await fetch(`/api/centers/${centerId}/lecturers`); // Example API route
                // if (!response.ok) throw new Error('Failed to fetch');
                // const fetchedLecturers: LecturerForAssignment[] = await response.json();

                // --- Start Placeholder Data/Logic ---
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 700));
                // Simulate fetched data (replace with actual fetched data)
                const fetchedLecturers: LecturerForAssignment[] = [
                     // Example data structure - replace with real data from your fetch
                    // { id: 'lecturer1', name: 'Dr. Alice', email: 'alice@test.com', departmentId: department.id }, // Example: Already assigned here
                    // { id: 'lecturer2', name: 'Prof. Bob', email: 'bob@test.com', departmentId: null }, // Example: Unassigned
                    // { id: 'lecturer3', name: 'Dr. Charlie', email: 'charlie@test.com', departmentId: 'other_dept_id' }, // Example: Assigned elsewhere (might not be fetched depending on API logic)
                ];
                // --- End Placeholder Data/Logic ---


                setLecturers(fetchedLecturers);
                // Initialize the set of currently assigned lecturers for this department
                const currentAssigned = new Set(
                    fetchedLecturers.filter(l => l.departmentId === department.id).map(l => l.id)
                );
                setAssignedIds(currentAssigned);

            } catch (error) {
                console.error("AssignLecturersDialog: Failed to fetch lecturers:", error);
                toast.error("Could not load lecturers list.");
                // Optionally close the dialog on fetch error
                // setIsOpen(false);
            } finally {
                setIsLoading(false); // Hide loading indicator
            }
        };
        fetchLecturers();
    }, [isOpen, centerId, department.id]); // Dependency array ensures fetch runs when dialog opens or relevant IDs change

    // Handle changes to the checkboxes
    const handleCheckboxChange = (lecturerId: string, checked: boolean | 'indeterminate') => {
        setAssignedIds(prev => {
            const newSet = new Set(prev); // Create a mutable copy
            if (checked === true) {
                newSet.add(lecturerId); // Add ID if checked
            } else {
                newSet.delete(lecturerId); // Remove ID if unchecked
            }
            return newSet; // Return the updated set
        });
    };

    // Handle saving the assignment changes
    const handleSaveChanges = async () => {
        setIsSaving(true); // Show saving indicator

        // Determine which assignments need to be made and which need to be removed
        const assignmentsToMake = lecturers.filter(l => assignedIds.has(l.id) && l.departmentId !== department.id);
        const unassignmentsToMake = lecturers.filter(l => !assignedIds.has(l.id) && l.departmentId === department.id);

        console.log("Assignments to make:", assignmentsToMake.map(l=>l.id));
        console.log("Unassignments to make:", unassignmentsToMake.map(l=>l.id));

        // Use Promise.allSettled to run actions concurrently and gather results
        const results = await Promise.allSettled([
            // Perform assignments
            ...assignmentsToMake.map(lecturer =>
                assignLecturerToDepartment({ centerId, departmentId: department.id, lecturerId: lecturer.id })
            ),
            // Perform unassignments
            ...unassignmentsToMake.map(lecturer =>
                 unassignLecturerFromDepartment({ centerId, lecturerId: lecturer.id })
            )
        ]);

        // Process results and show feedback
        let allSucceeded = true;
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                allSucceeded = false;
                console.error(`Assignment/Unassignment Error [${index}]:`, result.reason);
                // Show specific error if available, otherwise generic
                const message = (result.reason as any)?.message || "An error occurred saving changes.";
                toast.error(`Error updating assignment: ${message}`);
            } else if (result.value.success === false) {
                 allSucceeded = false;
                 toast.error(result.value.message || "An error occurred saving changes.");
            }
        });

        if (allSucceeded) {
            toast.success("Lecturer assignments updated successfully.");
            onAssignmentComplete(); // Trigger data refresh in the parent table
            setIsOpen(false); // Close the dialog
        } else {
             // Optionally refresh even on partial failure
             onAssignmentComplete();
        }

        setIsSaving(false); // Hide saving indicator
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* Button to open the dialog */}
                <Button variant="outline" size="sm"><Users className="mr-2 h-4 w-4" /> Assign Lecturers</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg"> {/* Adjust width if needed */}
                <DialogHeader>
                    <DialogTitle>Assign Lecturers to: {department.name}</DialogTitle>
                    <DialogDescription>Select lecturers from this center to assign them to this department.</DialogDescription>
                </DialogHeader>
                {/* Display loading state or lecturer list */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="max-h-[40vh] overflow-y-auto space-y-2 p-1 border rounded-md"> {/* Scrollable area */}
                        {lecturers.length > 0 ? lecturers.map(lecturer => (
                            // Row for each lecturer with checkbox
                            <div key={lecturer.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                                <Checkbox
                                    id={`lecturer-${lecturer.id}-${department.id}`} // Unique ID for label association
                                    checked={assignedIds.has(lecturer.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(lecturer.id, checked)}
                                    disabled={isSaving} // Disable while saving
                                    aria-label={`Assign ${lecturer.name || lecturer.email}`}
                                />
                                <label
                                    htmlFor={`lecturer-${lecturer.id}-${department.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                                >
                                    {lecturer.name || 'N/A'} <span className="text-xs text-muted-foreground">({lecturer.email})</span>
                                </label>
                            </div>
                        )) : <p className="text-sm text-muted-foreground text-center py-4">No lecturers found in this center to assign.</p>}
                    </div>
                )}
                <DialogFooter>
                     {/* Close button */}
                     <DialogClose asChild>
                         <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
                     </DialogClose>
                     {/* Save button */}
                    <Button
                        type="button"
                        onClick={handleSaveChanges}
                        disabled={isLoading || isSaving || lecturers.length === 0} // Disable if loading, saving, or no lecturers
                    >
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


// --- Helper Component: Edit Department Name Inline ---
interface EditDepartmentNameProps {
    department: DepartmentWithLecturerCount;
    onSave: () => void; // Callback to refresh table data after save
}

function EditDepartmentName({ department, onSave }: EditDepartmentNameProps) {
    const [isEditing, setIsEditing] = React.useState(false); // State to toggle input field
    const [newName, setNewName] = React.useState(department.name); // State for the input value
    const [isLoading, setIsLoading] = React.useState(false); // Loading state for the save action

    // Handle saving the edited name
    const handleSave = async () => {
        // Don't save if name hasn't changed or is too short
        if (newName === department.name || newName.trim().length < 2) {
            setIsEditing(false); // Exit editing mode
            setNewName(department.name); // Reset input value if invalid
            if (newName !== department.name) {
                 toast.warning("Department name must be at least 2 characters.");
            }
            return;
        }
        setIsLoading(true); // Show loading indicator
        try {
            // Call the server action to update the department
            const result = await updateDepartment({ departmentId: department.id, name: newName.trim(), centerId: department.centerId });
            if (result.success) {
                toast.success(result.message || "Department updated.");
                onSave(); // Trigger parent table data refresh
                setIsEditing(false); // Exit editing mode on success
            } else {
                toast.error(result.message || "Failed to update department.");
                setNewName(department.name); // Revert input value on server error
            }
        } catch (e) {
            toast.error("An unexpected error occurred while updating.");
            setNewName(department.name); // Revert input value on unexpected error
        }
        finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    // Render input field and save/cancel buttons when editing
    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-sm" // Smaller input
                    disabled={isLoading}
                    // Allow saving with Enter key
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } else if (e.key === 'Escape') { setIsEditing(false); setNewName(department.name) } }}
                    autoFocus // Focus input when it appears
                />
                <Button size="sm" onClick={handleSave} disabled={isLoading || newName.trim() === department.name || newName.trim().length < 2} className="h-8 px-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setNewName(department.name); }} disabled={isLoading} className="h-8 px-2">Cancel</Button>
            </div>
        );
    }

    // Render department name and a subtle edit button (visible on hover) when not editing
    return (
        <div className="flex items-center gap-2 group min-h-[32px]"> {/* Ensure consistent height */}
            <span className="text-sm">{department.name}</span>
            {/* Edit button appears on hover */}
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditing(true)} aria-label={`Edit department ${department.name}`}>
                <Pencil className="h-3 w-3" />
            </Button>
        </div>
    );
}


// --- Define table columns ---
// Function to generate column definitions dynamically
const getColumns = (
    centerId: string,
    refreshData: () => void // Callback function to refresh table data
): ColumnDef<DepartmentWithLecturerCount>[] => [
  {
    accessorKey: "name", // Key for the department name data
    header: ({ column }) => ( // Custom header with sorting button
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Department Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    // Use the inline edit component for the cell
    cell: ({ row }) => <EditDepartmentName department={row.original} onSave={refreshData} />,
    enableSorting: true, // Enable sorting for this column
  },
  {
    accessorKey: "_count.lecturers", // Access the pre-counted number of lecturers
    header: ({ column }) => ( // Custom header with sorting button
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Lecturers <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    // Center the count in the cell
    cell: ({ row }) => <div className="text-center">{row.original._count.lecturers}</div>,
    enableSorting: true, // Enable sorting by lecturer count
  },
  {
    id: "assign", // Custom ID for the assignment action column
    header: () => <div className="text-center">Assign Lecturers</div>, // Centered header text
    cell: ({ row }) => (
        // Center the "Assign Lecturers" button/dialog trigger
        <div className="text-center">
            <AssignLecturersDialog
                centerId={centerId}
                department={row.original}
                onAssignmentComplete={refreshData} // Pass refresh callback
            />
        </div>
    ),
    enableSorting: false, // Disable sorting for this action column
  },
  {
    id: "actions", // Custom ID for the delete action column
    header: () => <div className="text-right">Actions</div>, // Right-aligned header text
    cell: ({ row }) => { // Custom cell component for the delete action
        const department = row.original;
        const [isDeleting, setIsDeleting] = React.useState(false); // Loading state for delete action

        // Function to handle the delete confirmation and action call
        const handleDelete = async () => {
            setIsDeleting(true);
            try {
                // Call the delete server action
                const result = await deleteDepartment({ departmentId: department.id, centerId: centerId });
                if (result.success) {
                    toast.success(result.message || "Department deleted.");
                    refreshData(); // Refresh table data on success
                } else {
                    toast.error(result.message || "Failed to delete department.");
                }
            } catch (e) {
                toast.error("An unexpected error occurred while deleting.");
            } finally {
                setIsDeleting(false); // Ensure loading state is reset
            }
        };

      return (
          // Right-align the delete button/dialog trigger
          <div className="text-right">
            {/* Use AlertDialog for delete confirmation */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {/* Button to trigger the delete confirmation */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" // Destructive styling
                        disabled={isDeleting} // Disable while deleting
                        aria-label={`Delete department ${department.name}`}
                    >
                        {/* Show spinner if deleting, otherwise show trash icon */}
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the department "{department.name}"?
                            This will unassign all lecturers currently in this department. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90" // Destructive action styling
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
      );
    },
    enableSorting: false, // Disable sorting for this action column
  },
];

// --- Main Table Component ---
// Props definition for the main table component
interface DepartmentsTableProps {
  centerId: string; // ID of the center these departments belong to
  departments: DepartmentWithLecturerCount[]; // Array of department data including lecturer count
}

export function DepartmentsTable({ centerId, departments }: DepartmentsTableProps) {
  // State for managing table sorting
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter(); // Hook for refreshing server-fetched data

  // Callback function passed down to action components to trigger a data refresh
  const refreshData = () => {
      console.log("DepartmentsTable: Refreshing data...");
      router.refresh(); // Use Next.js router's refresh to refetch Server Component data
  };

  // Memoize the column definitions, passing the refresh callback
  // Regenerates if centerId changes (though unlikely in this component's lifecycle)
  const columns = React.useMemo(() => getColumns(centerId, refreshData), [centerId]);

  // Initialize the react-table instance
  const table = useReactTable({
    data: departments, // Data for the table
    columns, // Column definitions
    getCoreRowModel: getCoreRowModel(), // Core table logic
    getPaginationRowModel: getPaginationRowModel(), // Pagination logic
    getSortedRowModel: getSortedRowModel(), // Sorting logic
    onSortingChange: setSorting, // Connect sorting state setter
    state: { // Pass controlled state to the table
        sorting, // Current sorting configuration
    },
    initialState: { // Initial table settings
        pagination: { pageSize: 10 }, // Default rows per page
    },
  });

  // Render the table structure
  return (
    <div className="w-full space-y-3"> {/* Container with vertical spacing */}
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
              // Map over the rows provided by the table model
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"} // Apply selected state styling if needed
                >
                  {/* Map over the visible cells for the current row */}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No departments have been created for this center yet.
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
