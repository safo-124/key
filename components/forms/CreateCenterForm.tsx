"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, ArrowLeft, Building2, User } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

import { createCenter } from "@/lib/actions/registry.actions";
import type { AvailableCoordinator } from "@/app/(protected)/registry/centers/create/page";

const formSchema = z.object({
  centerName: z.string().min(3, {
    message: "Center name must be at least 3 characters long.",
  }).max(100, {
     message: "Center name must not exceed 100 characters.",
  }),
  coordinatorId: z.string().cuid({
    message: "You must select a valid coordinator.",
  }),
});

type CreateCenterFormValues = z.infer<typeof formSchema>;

interface CreateCenterFormProps {
  availableCoordinators: AvailableCoordinator[];
  fetchError: string | null;
}

export function CreateCenterForm({ availableCoordinators, fetchError }: CreateCenterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<CreateCenterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      centerName: "",
      coordinatorId: "",
    },
  });

  async function onSubmit(values: CreateCenterFormValues) {
    setIsLoading(true);
    console.log("Submitting new center:", values);

    try {
      const result = await createCenter(values);

      if (result.success) {
        toast.success(result.message || "Center created successfully!", {
          description: `${values.centerName} has been created.`,
        });
        router.push('/registry/centers');
      } else {
        toast.error(result.message || "Failed to create center.", {
          description: "Please check your inputs and try again.",
        });
      }
    } catch (error) {
      console.error("Create center form error:", error);
      toast.error("An unexpected error occurred.", {
        description: "Our team has been notified. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (fetchError) {
    return (
      <Alert variant="destructive" className="border-red-300 bg-red-50">
        <Terminal className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Error Loading Data</AlertTitle>
        <AlertDescription className="text-red-700">
          {fetchError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Center Name Field */}
        <FormField
          control={form.control}
          name="centerName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <FormLabel className="text-gray-800">Center Name</FormLabel>
              </div>
              <FormControl>
                <Input 
                  placeholder="e.g., Central Campus Teaching Center" 
                  {...field} 
                  disabled={isLoading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                The official name of the new center.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Coordinator Selection Field */}
        <FormField
          control={form.control}
          name="coordinatorId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <FormLabel className="text-gray-800">Assign Coordinator</FormLabel>
              </div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || availableCoordinators.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select an available coordinator" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-gray-300 shadow-lg">
                  {availableCoordinators.length > 0 ? (
                    availableCoordinators.map((coord) => (
                      <SelectItem 
                        key={coord.id} 
                        value={coord.id}
                        className="hover:bg-blue-50 focus:bg-blue-50"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{coord.name || 'Unnamed User'}</span>
                          <span className="text-sm text-gray-500">{coord.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-coordinators" disabled>
                      No available coordinators found.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-500">
                Choose a coordinator who is not already managing a center.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || availableCoordinators.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Center"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}