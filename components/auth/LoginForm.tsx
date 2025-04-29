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
import { loginUser } from "@/lib/actions/auth.actions";

// Define the validation schema using Zod (same as before)
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

// Define the type for the form values based on the schema
type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // Remove the local errorMessage state, rely on toast for feedback
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // 1. Define your form using react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true); // Show loading state
    // setErrorMessage(null); // Clear previous errors - removed

    try {
      // --- Call the actual Server Action ---
      const result = await loginUser(values);

      if (result.success) {
        toast.success(result.message || "Logged in successfully!");
        // --- Redirect user to dashboard on success ---
        // Use window.location for simplicity here. Consider useRouter from 'next/navigation' for SPA feel.
        window.location.href = '/dashboard'; // Redirect to the main dashboard
      } else {
        // Display error message from the server action using toast
        toast.error(result.message || "Login failed. Please check your credentials.");
        // Optionally reset password field on failure
        form.setValue("password", "");
      }
      // --- End of Server Action call section ---

    } catch (error) {
      console.error("Login form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      form.setValue("password", ""); // Clear password on unexpected errors too
    } finally {
      setIsLoading(false); // Hide loading state regardless of outcome
    }
  }

  return (
    <Form {...form}> {/* Spread form methods into the shadcn Form component */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {...field} // Spread field props (onChange, onBlur, value, etc.)
                  disabled={isLoading} // Disable input when loading
                />
              </FormControl>
              <FormMessage /> {/* Displays validation errors for this field */}
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

        {/* Removed General Error Message Area - relying on toast */}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
