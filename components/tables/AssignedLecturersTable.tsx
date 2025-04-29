"use client"; // Mark as Client Component due to hooks (useState, useMemo, useRouter) and event handlers

import * as React from "react";
import {
  ColumnDef, // Type for defining table columns
  flexRender, // Helper function to render components in cells/headers
  getCoreRowModel, // Core table logic
  useReactTable, // Hook to create table instance
  getPaginationRowModel, // Enables pagination logic
  getSortedRowModel, // Enables sorting logic
  SortingState, // Type for sorting state
} from "@tanstack/react-table";
import { Loader2, UserX, ArrowUpDown, Building2 } from "lucide-react"; // Icons for UI elements (Added Building2)
import { useRouter } from 'next/navigation'; // Hook for programmatic navigation (used in button)

// Import necessary UI components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // To display department
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
} from "@/components/ui/alert-dialog"; // Component for confirmation dialogs
import { toast } from "sonner"; // For displaying notifications

// Import the server action (only needed if actions are shown)
import { unassignLecturerFromCenter } from "@/lib/actions/registry.actions";

// Define the expected shape of the lecturer data passed to the table
// ** UPDATED to include optional department **
export type AssignedLecturer = {
  id: string;
  name: string | null;
  email: string;
  department?: { // Department is optional
      id: string;
      name: string;
  } | null;
};

// --- Remove Lecturer Button Sub-Component ---
// Encapsulates the logic for the remove button and its confirmation dialog
interface RemoveLecturerButtonProps {
  centerId: string;
  lecturer: AssignedLecturer;
  onRemoveStart: () => void; // Callback when removal starts (for loading state)
  onRemoveEnd: () => void;   // Callback when removal ends
}

function RemoveLecturerButton({ centerId, lecturer, onRemoveStart, onRemoveEnd }: RemoveLecturerButtonProps) {
    const router = useRouter(); // Hook to refresh the page data after removal
    const [isRemoving, setIsRemoving] = React.useState(false); // State for loading indicator within the dialog
    const [isDialogOpen, setIsDialogOpen] = React.useState(false); // State to control dialog visibility

    // Function to handle the actual removal process
    const handleRemove = async () => {
        setIsRemoving(true); // Show loading indicator
        onRemoveStart(); // Notify parent table row about loading state
        console.log(`Attempting to remove lecturer ${lecturer.id} from center ${centerId}`);

        try {
            // Call the server action to perform the unassignment
            const result = await unassignLecturerFromCenter({ centerId, lecturerId: lecturer.id });
            if (result.success) {
                toast.success(result.message || "Lecturer removed successfully.");
                setIsDialogOpen(false); // Close the dialog on success
                router.refresh(); // Refresh the page data to update the table
            } else {
                toast.error(result.message || "Failed to remove lecturer.");
            }
        } catch (error) {
            console.error("Remove lecturer error:", error);
            toast.error("An unexpected error occurred during removal.");
        } finally {
            setIsRemoving(false); // Hide loading indicator
            onRemoveEnd(); // Notify parent table row that loading has ended
        }
    };

    // Render the confirmation dialog trigger (button) and the dialog itself
    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                {/* Button that triggers the dialog */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 w-8 h-8 p-0" // Destructive styling
                    disabled={isRemoving} // Disable trigger while action is in progress
                    aria-label={`Remove ${lecturer.name || lecturer.email}`}
                >
                    {/* Show spinner if removing, otherwise show remove icon */}
                    {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will remove{' '}
                        <strong>{lecturer.name || lecturer.email}</strong>{' '}
                        from this center. They will become unassigned.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Destructive action button styling
                    >
                        {isRemoving ? "Removing..." : "Yes, Remove Lecturer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


// --- Define Table Columns ---
// Function to generate column definitions dynamically based on whether actions should be shown
const getColumns = (
    centerId: string,
    showActions: boolean, // Parameter to control action column visibility
    setRowLoading: (rowId: string, isLoading: boolean) => void // Callback to manage row loading state
): ColumnDef<AssignedLecturer>[] => {
    // Base columns (always shown)
    const columns: ColumnDef<AssignedLecturer>[] = [
      {
        accessorKey: "name", // Key in the data object for this column
        header: ({ column }) => ( // Custom header component to add sorting button
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Name <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting indicator */}
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.name || 'N/A'}</div>, // Display name or 'N/A'
      },
      {
        accessorKey: "email",
         header: ({ column }) => ( // Custom header for sorting
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Email <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.original.email}</div>, // Display email
      },
      // --- NEW Department Column ---
      {
        accessorKey: "department.name", // Access nested name property
        header: ({ column }) => ( // Custom header for sorting
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Department <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => { // Custom cell to display department or 'Unassigned'
            const departmentName = row.original.department?.name;
            return departmentName
                ? <Badge variant="outline" className="whitespace-nowrap"><Building2 className="mr-1 h-3 w-3"/>{departmentName}</Badge>
                : <span className="text-xs text-muted-foreground">Unassigned</span>;
        },
        sortingFn: 'text', // Use basic text sorting for department names
        enableSorting: true,
      },
      // --- End of New Column ---
    ];

    // Conditionally add the "Actions" column if showActions is true
    if (showActions) {
        columns.push({
            id: "actions", // Unique ID for the column
            header: () => <div className="text-right pr-4">Actions</div>, // Right-align header text
            cell: ({ row }) => { // Custom cell component for actions
                const lecturer = row.original; // Get the data for the current row
                return (
                    <div className="text-right"> {/* Right-align the button */}
                        {/* Render the RemoveLecturerButton component */}
                        <RemoveLecturerButton
                            centerId={centerId}
                            lecturer={lecturer}
                            // Pass callbacks to update loading state in the parent table
                            onRemoveStart={() => setRowLoading(row.id, true)}
                            onRemoveEnd={() => setRowLoading(row.id, false)}
                        />
                    </div>
                );
            },
        });
    }

    return columns; // Return the array of column definitions
};

// --- Main Table Component ---
// Props definition for the main table component
interface AssignedLecturersTableProps {
  centerId: string; // ID of the center these lecturers belong to
  assignedLecturers: AssignedLecturer[]; // Array of lecturer data (now includes optional department)
  showActions?: boolean; // Optional prop to control actions column visibility (defaults to true)
}

export function AssignedLecturersTable({
    centerId,
    assignedLecturers,
    showActions = true // Default showActions to true (for Registry view)
}: AssignedLecturersTableProps) {
  // State to track loading status for individual rows (used for visual feedback)
  const [rowLoadingState, setRowLoadingState] = React.useState<Record<string, boolean>>({});
  // State to manage the table's sorting configuration
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Callback function passed to RemoveLecturerButton to update row loading state
  const setRowLoading = (rowId: string, isLoading: boolean) => {
    setRowLoadingState(prev => ({ ...prev, [rowId]: isLoading }));
  };

  // Memoize the columns definition to prevent unnecessary recalculations
  // Regenerates if centerId or showActions changes
  const columns = React.useMemo(() => getColumns(centerId, showActions, setRowLoading), [centerId, showActions]);

  // Initialize the react-table instance
  const table = useReactTable({
    data: assignedLecturers, // The data to display
    columns, // The column definitions
    getCoreRowModel: getCoreRowModel(), // Core row model logic
    getPaginationRowModel: getPaginationRowModel(), // Pagination logic
    getSortedRowModel: getSortedRowModel(), // Sorting logic
    onSortingChange: setSorting, // Function to update sorting state when user sorts
    state: { // Pass controlled state to the table
        sorting, // Current sorting state
    },
    initialState: { // Initial table state configuration
        pagination: { pageSize: 10 }, // Set default number of rows per page
    },
  });

  // Render the table structure
  return (
    <div className="w-full space-y-3"> {/* Container with vertical spacing */}
      {/* Table container with border */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* Map over header groups (usually just one) */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* Map over headers in the group */}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {/* Render the header content using flexRender */}
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
            {/* Check if there are rows to display */}
            {table.getRowModel().rows?.length ? (
              // Map over the rows in the current page view
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  // Apply visual state if the row is currently loading (optional)
                  data-state={rowLoadingState[row.id] ? 'loading' : undefined}
                  // Dim the row slightly if it's loading (optional)
                  className={rowLoadingState[row.id] ? 'opacity-50 transition-opacity' : ''}
                >
                  {/* Map over the visible cells in the row */}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {/* Render the cell content using flexRender */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Display a message if there are no rows
              <TableRow>
                <TableCell
                  // ** Adjust colspan to account for the new department column **
                  colSpan={columns.length} // Span across all columns
                  className="h-24 text-center" // Style for empty state
                >
                  No lecturers currently assigned to this center.
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
