"use client"; // Mark as a Client Component because it uses hooks and event handlers

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod"; // Integrates Zod with React Hook Form
import { useForm } from "react-hook-form"; // Hook for managing form state and validation
import * as z from "zod"; // Library for schema validation
import { Loader2, UserPlus } from "lucide-react"; // Icons for UI feedback
import { useRouter } from 'next/navigation'; // Hook for programmatic navigation (used for refresh)

// Import necessary UI components from shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select component for department dropdown
import { toast } from "sonner"; // Library for displaying toast notifications
import { Department, Role } from "@prisma/client"; // Import Department type from Prisma Client

// Import the specific server action for coordinators to create lecturers
import { createLecturerForCenter } from "@/lib/actions/coordinator.actions";

// Define the validation schema using Zod.
// This should align with the validation in the corresponding server action.
const formSchema = z.object({
  // Name is optional, but must meet length constraints if provided
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100).optional(),
  // Email must be a valid email format
  email: z.string().email({ message: "Please enter a valid email address." }),
  // Password must be at least 8 characters long
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  // Department ID is optional (can be null or a valid CUID string)
  departmentId: z.string().cuid("Invalid Department ID format.").optional().nullable(),
});

// Infer the TypeScript type for the form values from the Zod schema
type CreateLecturerFormValues = z.infer<typeof formSchema>;

// Define the props expected by the component
interface CreateLecturerFormProps {
    centerId: string; // The ID of the center this coordinator manages
    departments: Pick<Department, 'id' | 'name'>[]; // List of departments in this center for the dropdown
}

// Define the CreateLecturerForm component
export function CreateLecturerForm({ centerId, departments }: CreateLecturerFormProps) {
  const router = useRouter(); // Initialize router for refreshing page data
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // State for submit button loading indicator

  // Initialize react-hook-form
  const form = useForm<CreateLecturerFormValues>({
    resolver: zodResolver(formSchema), // Use Zod for validation
    defaultValues: { // Set initial form values
      name: "",
      email: "",
      password: "",
      departmentId: null, // Start with no department selected
    },
  });

  // Function to handle form submission
  async function onSubmit(values: CreateLecturerFormValues) {
    setIsLoading(true); // Indicate loading state

    // Ensure that an empty string value from the department select (our 'none' option)
    // is converted to null before sending to the server action.
    const submitValues = {
        ...values,
        departmentId: values.departmentId === "" || values.departmentId === "none" ? null : values.departmentId
    };

    console.log("Submitting new lecturer for center:", centerId, submitValues); // Debug log

    try {
      // Call the server action, passing the centerId along with the form values
      const result = await createLecturerForCenter({ ...submitValues, centerId });

      // Handle the result from the server action
      if (result.success) {
        toast.success(result.message || "Lecturer created successfully!"); // Show success message
        form.reset(); // Reset the form fields to their default values
        router.refresh(); // Refresh the server-fetched data for the current page (updates lecturer list)
      } else {
        // Show error message if the action failed
        toast.error(result.message || "Failed to create lecturer.");
      }
    } catch (error) {
      // Catch any unexpected errors during the server action call
      console.error("Create lecturer form error:", error);
      toast.error("An unexpected error occurred while creating the lecturer.");
    } finally {
      // Ensure loading state is turned off
      setIsLoading(false);
    }
  }

  // Render the form
  return (
    <Form {...form}> {/* Pass form methods to the shadcn Form component */}
      {/* Add styling and structure to the form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md bg-card shadow-sm">
         <h4 className="text-md font-semibold mb-3 text-card-foreground">Create New Lecturer for this Center</h4>

        {/* User Name Field (Optional) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Smith" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage /> {/* Displays validation errors */}
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="lecturer@example.com" {...field} disabled={isLoading} />
              </FormControl>
               <FormDescription>
                Must be unique across the system. Used for login.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
              </FormControl>
               <FormDescription>
                Minimum 8 characters. The lecturer can change this later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department Selection Field (Optional) */}
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Department (Optional)</FormLabel>
              {/* Use Select component for the dropdown */}
              <Select
                // Update form state when selection changes
                // Convert the special 'none' value back to null for the form state
                onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                // Use the field's value, defaulting to 'none' if it's null/undefined
                value={field.value ?? 'none'}
                disabled={isLoading || departments.length === 0} // Disable if loading or no departments exist
              >
                <FormControl>
                  <SelectTrigger>
                    {/* Display placeholder text */}
                    <SelectValue placeholder="Select a department (optional)..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Explicit option for not assigning a department */}
                  <SelectItem value="none">-- No Department --</SelectItem>
                  {/* Map over the departments passed via props to create options */}
                  {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionally assign the new lecturer to a department within this center.
              </FormDescription>
              <FormMessage /> {/* Displays validation errors for department selection */}
            </FormItem>
          )}
        />


        {/* Submit Button */}
        <div className="flex justify-end pt-2"> {/* Align button to the right */}
            <Button type="submit" disabled={isLoading}> {/* Disable button while loading */}
            {isLoading ? (
                // Show loading state
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating... </>
            ) : (
                 // Show normal state
                 <> <UserPlus className="mr-2 h-4 w-4" /> Create Lecturer </>
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
