"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

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
} from "@/components/ui/select"; // Import Select components
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

// Import the server action we will create
import { createCenter } from "@/lib/actions/registry.actions";
// Import the type for available coordinators from the page component
import type { AvailableCoordinator } from "@/app/(protected)/registry/centers/create/page";

// Validation schema using Zod
const formSchema = z.object({
  centerName: z.string().min(3, {
    message: "Center name must be at least 3 characters long.",
  }).max(100, {
     message: "Center name must not exceed 100 characters.",
  }),
  coordinatorId: z.string().cuid({ // Expecting a CUID from the select value
    message: "You must select a valid coordinator.",
  }),
});

type CreateCenterFormValues = z.infer<typeof formSchema>;

interface CreateCenterFormProps {
  availableCoordinators: AvailableCoordinator[];
  fetchError: string | null; // Receive fetch error from the page
}

export function CreateCenterForm({ availableCoordinators, fetchError }: CreateCenterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<CreateCenterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      centerName: "",
      coordinatorId: "", // Initialize as empty
    },
  });

  async function onSubmit(values: CreateCenterFormValues) {
    setIsLoading(true);
    console.log("Submitting new center:", values);

    try {
      const result = await createCenter(values);

      if (result.success) {
        toast.success(result.message || "Center created successfully!");
        // Redirect back to the centers list on success
        router.push('/registry/centers');
        // Optionally revalidate path can be done in server action
      } else {
        toast.error(result.message || "Failed to create center.");
      }
    } catch (error) {
      console.error("Create center form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

   // Display fetch error if coordinator list couldn't be loaded
   if (fetchError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>{fetchError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Center Name Field */}
        <FormField
          control={form.control}
          name="centerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Center Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Central Campus Teaching Center" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                The official name of the new center.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Coordinator Selection Field */}
        <FormField
          control={form.control}
          name="coordinatorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Coordinator</FormLabel>
              <Select
                onValueChange={field.onChange} // Update form state on change
                defaultValue={field.value}
                disabled={isLoading || availableCoordinators.length === 0} // Disable if loading or no options
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an available coordinator" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCoordinators.length > 0 ? (
                    availableCoordinators.map((coord) => (
                      <SelectItem key={coord.id} value={coord.id}>
                        {/* Display name and email for clarity */}
                        {coord.name || 'Unnamed User'} ({coord.email})
                      </SelectItem>
                    ))
                  ) : (
                     // Show a disabled item if no coordinators are available
                     <SelectItem value="no-coordinators" disabled>
                        No available coordinators found.
                     </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a user with the Coordinator role who is not already managing a center.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.back()} // Go back button
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button type="submit" disabled={isLoading || availableCoordinators.length === 0}>
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
                </>
            ) : (
                "Create Center"
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
