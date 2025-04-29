"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Import the server action
import { createDepartment } from "@/lib/actions/coordinator.actions";

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
});

type CreateDepartmentFormValues = z.infer<typeof formSchema>;

interface CreateDepartmentFormProps {
    centerId: string;
}

export function CreateDepartmentForm({ centerId }: CreateDepartmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: CreateDepartmentFormValues) {
    setIsLoading(true);
    console.log("Submitting new department:", values.name, "for center:", centerId);

    try {
      const result = await createDepartment({ ...values, centerId }); // Pass centerId along
      if (result.success) {
        toast.success(result.message || "Department created!");
        form.reset(); // Clear the form
        router.refresh(); // Refresh page data
      } else {
        toast.error(result.message || "Failed to create department.");
      }
    } catch (error) {
      console.error("Create department form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4 border p-4 rounded-md bg-muted/30">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel className="sr-only">Department Name</FormLabel> {/* Hide label visually */}
              <FormControl>
                <Input placeholder="Enter new department name..." {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
        </Button>
      </form>
    </Form>
  );
}