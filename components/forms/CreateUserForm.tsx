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
} from "@/components/ui/select";
import { toast } from "sonner";
import { Role } from "@prisma/client"; // Import Role enum

// Import the server action
import { createUser } from "@/lib/actions/registry.actions";

// Validation schema using Zod
// Matches the schema defined in the server action
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.nativeEnum(Role).refine(role => role !== Role.REGISTRY, {
      message: "Please select either Coordinator or Lecturer."
  }), // Ensure a valid, non-Registry role is selected
});

type CreateUserFormValues = z.infer<typeof formSchema>;

export function CreateUserForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined, // Start with no role selected
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    setIsLoading(true);
    console.log("Submitting new user:", values);

    try {
      const result = await createUser(values);

      if (result.success) {
        toast.success(result.message || "User created successfully!");
        // Redirect back to the users list on success
        router.push('/registry/users');
      } else {
        toast.error(result.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Create user form error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* User Name Field (Optional) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} disabled={isLoading} />
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
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} disabled={isLoading} />
              </FormControl>
               <FormDescription>
                This will be used for login. Must be unique.
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
                Minimum 8 characters. The user can change this later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Selection Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role for the user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Only allow selecting Coordinator or Lecturer */}
                  <SelectItem value={Role.COORDINATOR}>Coordinator</SelectItem>
                  <SelectItem value={Role.LECTURER}>Lecturer</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the user's primary role in the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating... </>
            ) : (
                 <> <UserPlus className="mr-2 h-4 w-4" /> Create User </>
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
