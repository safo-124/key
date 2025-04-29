"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, UserCog } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import the server action
import { changeCenterCoordinator } from "@/lib/actions/registry.actions";
// Import the type for available coordinators
import type { AvailableCoordinator } from "@/app/(protected)/registry/centers/[centerId]/coordinator/page";

// Validation schema
const formSchema = z.object({
  newCoordinatorId: z.string().cuid({ message: "You must select a valid coordinator." }),
});

type ChangeCoordinatorFormValues = z.infer<typeof formSchema>;

interface ChangeCoordinatorFormProps {
  centerId: string;
  currentCoordinatorId: string | null;
  availableCoordinators: AvailableCoordinator[];
}

export function ChangeCoordinatorForm({ centerId, currentCoordinatorId, availableCoordinators }: ChangeCoordinatorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<ChangeCoordinatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newCoordinatorId: "",
    },
  });

  async function onSubmit(values: ChangeCoordinatorFormValues) {
    // Prevent submitting if the selected coordinator is the current one
    if (values.newCoordinatorId === currentCoordinatorId) {
        toast.info("The selected user is already the coordinator for this center.");
        return;
    }

    setIsLoading(true);
    console.log(`Changing coordinator for center ${centerId} to ${values.newCoordinatorId}`);

    try {
      const result = await changeCenterCoordinator({ centerId, newCoordinatorId: values.newCoordinatorId });

      if (result.success) {
        toast.success(result.message || "Coordinator changed successfully!");
        form.reset(); // Clear selection
        router.refresh(); // Refresh page data to show the new coordinator
      } else {
        toast.error(result.message || "Failed to change coordinator.");
      }
    } catch (error) {
      console.error("Change coordinator form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newCoordinatorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select New Coordinator</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || availableCoordinators.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an available coordinator..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCoordinators.length > 0 ? (
                    availableCoordinators.map((coord) => (
                      <SelectItem key={coord.id} value={coord.id}>
                        {coord.name || 'Unnamed User'} ({coord.email})
                      </SelectItem>
                    ))
                  ) : (
                     <SelectItem value="no-coordinators" disabled>
                        No other available coordinators found.
                     </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a user with the Coordinator role who is not currently managing any center.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || availableCoordinators.length === 0}>
            {isLoading ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning... </>
            ) : (
                <> <UserCog className="mr-2 h-4 w-4" /> Assign New Coordinator </>
            )}
            </Button>
        </div>
         {availableCoordinators.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
                There are no other users with the 'Coordinator' role available to be assigned.
            </p>
        )}
      </form>
    </Form>
  );
}
