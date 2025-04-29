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
import { toast } from "sonner";

// Import the server action we will create
import { updateCenterName } from "@/lib/actions/registry.actions";

// Validation schema
const formSchema = z.object({
  centerName: z.string().min(3, {
    message: "Center name must be at least 3 characters long.",
  }).max(100, {
     message: "Center name must not exceed 100 characters.",
  }),
});

type EditCenterFormValues = z.infer<typeof formSchema>;

interface EditCenterFormProps {
  centerId: string;
  currentName: string;
}

export function EditCenterForm({ centerId, currentName }: EditCenterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<EditCenterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      centerName: currentName || "", // Pre-fill with the current name
    },
  });

  async function onSubmit(values: EditCenterFormValues) {
    // Check if the name has actually changed
    if (values.centerName === currentName) {
        toast.info("No changes detected in the center name.");
        return; // Don't submit if nothing changed
    }

    setIsLoading(true);
    console.log(`Updating center ${centerId} name to:`, values.centerName);

    try {
      const result = await updateCenterName({ centerId, newName: values.centerName });

      if (result.success) {
        toast.success(result.message || "Center name updated successfully!");
        // Refresh the page data - revalidatePath in action handles cache,
        // router.refresh() updates the UI with fresh server data
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update center name.");
        // Optionally reset form to original value on server error
        // form.reset({ centerName: currentName });
      }
    } catch (error) {
      console.error("Update center form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="centerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Center Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Central Campus Teaching Center" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || form.getValues("centerName") === currentName}>
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
                </>
            ) : (
                "Save Name Changes"
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
