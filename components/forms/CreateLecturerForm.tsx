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
import { Department, Role } from "@prisma/client";
import { createLecturerForCenter } from "@/lib/actions/coordinator.actions";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  departmentId: z.string().cuid("Invalid Department ID format.").optional().nullable(),
});

type CreateLecturerFormValues = z.infer<typeof formSchema>;

interface CreateLecturerFormProps {
    centerId: string;
    departments: Pick<Department, 'id' | 'name'>[];
}

export function CreateLecturerForm({ centerId, departments }: CreateLecturerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<CreateLecturerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departmentId: null,
    },
  });

  async function onSubmit(values: CreateLecturerFormValues) {
    setIsLoading(true);
    const submitValues = {
        ...values,
        departmentId: values.departmentId === "" || values.departmentId === "none" ? null : values.departmentId
    };

    try {
      const result = await createLecturerForCenter({ ...submitValues, centerId });

      if (result.success) {
        toast.success(result.message || "Lecturer created successfully!", {
          description: `${values.email} has been registered.`
        });
        form.reset();
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create lecturer.", {
          description: "Please check the details and try again."
        });
      }
    } catch (error) {
      console.error("Create lecturer form error:", error);
      toast.error("An unexpected error occurred.", {
        description: "Our team has been notified. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., John Smith" 
                    {...field} 
                    disabled={isLoading}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs" />
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
                  <Input 
                    type="email" 
                    placeholder="lecturer@example.com" 
                    {...field} 
                    disabled={isLoading}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Must be unique across the system. Used for login.
                </FormDescription>
                <FormMessage className="text-red-600 text-xs" />
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
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={isLoading}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Minimum 8 characters. The lecturer can change this later.
                </FormDescription>
                <FormMessage className="text-red-600 text-xs" />
              </FormItem>
            )}
          />

          {/* Department Selection */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Department (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                  value={field.value ?? 'none'}
                  disabled={isLoading || departments.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select a department..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-gray-200">
                    <SelectItem value="none" className="text-gray-500">
                      -- No Department --
                    </SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="hover:bg-blue-50">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-xs">
                  Optionally assign the new lecturer to a department within this center.
                </FormDescription>
                <FormMessage className="text-red-600 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Lecturer
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}