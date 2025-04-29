"use client"; // Mark this as a Client Component

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react"; // For loading spinner

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Using sonner for toasts

// --- Import the actual server action ---
import { signupUser } from "@/lib/actions/auth.actions";

// Define the validation schema using Zod (same as before)
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

// Define the type for the form values based on the schema
type SignupFormValues = z.infer<typeof formSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // Remove the local errorMessage state, rely on toast for feedback
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // 1. Define your form using react-hook-form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    // setErrorMessage(null); // removed

    // Exclude confirmPassword before sending to the server action
    const { confirmPassword, ...submitData } = values;

    try {
      // --- Call the actual Server Action ---
      const result = await signupUser(submitData);

      if (result.success) {
        toast.success(result.message || "Account created successfully!");
        // --- Redirect user (e.g., to login page) ---
        // Use window.location for simplicity.
        window.location.href = '/login'; // Redirect to login after successful signup
        form.reset(); // Reset form on success
      } else {
        toast.error(result.message || "Signup failed. Please try again.");
        // Don't reset email/name, but clear passwords on failure
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
      }
      // --- End of Server Action call section ---

    } catch (error) {
      console.error("Signup form submission error:", error);
      toast.error("An unexpected error occurred during signup.");
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Removed General Error Message Area - relying on toast */}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
