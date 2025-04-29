"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import { useRouter } from 'next/navigation'; // Use router for navigation/refresh

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
import { Textarea } from "@/components/ui/textarea"; // For description
import { toast } from "sonner";

// Import the server action
import { createClaim } from "@/lib/actions/lecturer.actions";

// Validation schema using Zod - should match the action's schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(150),
  description: z.string().max(1000).optional(),
  amount: z.coerce // Use coerce for number conversion from string input
    .number({ required_error: "Amount is required.", invalid_type_error: "Amount must be a number." })
    .positive({ message: "Amount must be positive." })
    .finite(),
});

type CreateClaimFormValues = z.infer<typeof formSchema>;

export function CreateClaimForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<CreateClaimFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: undefined, // Initialize amount as undefined
    },
  });

  async function onSubmit(values: CreateClaimFormValues) {
    setIsLoading(true);
    console.log("Submitting new claim:", values);

    try {
      // Call the server action
      const result = await createClaim(values);

      if (result.success) {
        toast.success(result.message || "Claim submitted successfully!");
        form.reset(); // Reset form on success
        // Redirect back to the claims list for the current center
        // Need to get centerId - ideally passed as prop or read from context/URL client-side
        // For now, just refresh (assuming user is on create page within center context)
        router.refresh(); // Refresh data
        // Or redirect explicitly if possible: router.push(`/lecturer/${centerId}/claims`);
      } else {
        toast.error(result.message || "Failed to submit claim.");
      }
    } catch (error) {
      console.error("Create claim form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Claim Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Claim Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Conference Travel Expenses" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>A brief title for your claim.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Claim Amount Field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                {/* Use type="number" but handle string conversion via zod coerce */}
                <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01" // Allow decimal input
                    {...field}
                    // Ensure onChange passes the value correctly for coercion
                    onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)}
                    value={field.value ?? ''} // Handle undefined value for input
                    disabled={isLoading}
                 />
              </FormControl>
              <FormDescription>Enter the total amount being claimed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Claim Description Field (Optional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide any additional details or justification for the claim..."
                  className="resize-y min-h-[100px]" // Allow vertical resize
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Submit Button */}
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting... </>
            ) : (
                 <> <Send className="mr-2 h-4 w-4" /> Submit Claim </>
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}