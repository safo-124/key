"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import the server action
import { assignLecturerToCenter } from "@/lib/actions/registry.actions";
// Import the type for available lecturers
import type { AvailableLecturer } from "@/app/(protected)/registry/centers/[centerId]/lecturers/page";

// Validation schema
const formSchema = z.object({
  lecturerId: z.string().cuid({ message: "You must select a valid lecturer." }),
});

type AddLecturerFormValues = z.infer<typeof formSchema>;

interface AddLecturerFormProps {
  centerId: string;
  availableLecturers: AvailableLecturer[];
}

export function AddLecturerForm({ centerId, availableLecturers }: AddLecturerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<AddLecturerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lecturerId: "",
    },
  });

  async function onSubmit(values: AddLecturerFormValues) {
    setIsLoading(true);
    console.log(`Assigning lecturer ${values.lecturerId} to center ${centerId}`);

    try {
      const result = await assignLecturerToCenter({ centerId, lecturerId: values.lecturerId });

      if (result.success) {
        toast.success(result.message || "Lecturer assigned successfully!");
        form.reset(); // Clear the selection
        router.refresh(); // Refresh page data to update lists
      } else {
        toast.error(result.message || "Failed to assign lecturer.");
      }
    } catch (error) {
      console.error("Assign lecturer form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
        <FormField
          control={form.control}
          name="lecturerId"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Available Lecturers</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || availableLecturers.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lecturer to add..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableLecturers.length > 0 ? (
                    availableLecturers.map((lect) => (
                      <SelectItem key={lect.id} value={lect.id}>
                        {lect.name || 'Unnamed User'} ({lect.email})
                      </SelectItem>
                    ))
                  ) : (
                     <SelectItem value="no-lecturers" disabled>
                        No available lecturers found.
                     </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || availableLecturers.length === 0}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
             <> <UserPlus className="mr-2 h-4 w-4" /> Assign </>
          )}
        </Button>
      </form>
       {availableLecturers.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
                There are no lecturers currently available to be assigned. New users must sign up or be created with the 'Lecturer' role.
            </p>
        )}
    </Form>
  );
}
