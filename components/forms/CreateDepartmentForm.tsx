"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createDepartment } from "@/lib/actions/coordinator.actions";

const formSchema = z.object({
  name: z.string()
    .min(2, "Department name must be at least 2 characters")
    .max(50, "Department name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s\-&]+$/, "Only letters, numbers, spaces, hyphens, and ampersands are allowed"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateDepartmentFormProps {
  centerId: string;
  className?: string;
}

export function CreateDepartmentForm({ 
  centerId,
  className = ""
}: CreateDepartmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
    mode: "onChange"
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await createDepartment({ 
        name: values.name.trim(),
        centerId 
      });

      if (result?.success) {
        toast.success("Department created successfully");
        form.reset();
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to create department");
      }
    } catch (error) {
      console.error("Department creation error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Department Name</FormLabel>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Input
                      placeholder="e.g. Computer Science"
                      className="h-10 text-base"
                      autoComplete="off"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <Button 
                    type="submit" 
                    size="sm"
                    className="h-10 gap-1.5 px-4"
                    disabled={isSubmitting || !form.formState.isValid}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" />
                        <span>Add</span>
                      </>
                    )}
                  </Button>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}