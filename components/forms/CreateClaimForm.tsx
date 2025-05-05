"use client";

import * as React from "react";
// Removed zodResolver initially to simplify - validation will primarily happen server-side for now
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { format } from "date-fns";
import { CalendarIcon, Loader2, Send, PlusCircle, Trash2, BookOpen, Car, GraduationCap } from "lucide-react";
import { useRouter } from 'next/navigation';

// Assuming these components are correctly set up in your project structure
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming sonner is configured
import { cn } from "@/lib/utils"; // Your utility function for class names

// Import Prisma types - Ensure prisma generate has run
import { ClaimType, TransportType, ThesisType, SupervisionRank } from "@prisma/client";
// Import the server action
import { createClaim } from "@/lib/actions/lecturer.actions"; // Use the action you provided

// --- Define a simple type for the form values (without complex Zod validation for now) ---
// This mirrors the fields used in the form UI.
type CreateClaimFormValues = {
    claimType?: ClaimType; // Optional initially
    description?: string | null;
    // Teaching fields
    teachingDate?: Date | null;
    teachingStartTime?: string | null;
    teachingEndTime?: string | null;
    teachingHours?: number | string | null; // Allow string input, convert later
    // Transportation fields
    transportType?: TransportType | null;
    transportDestinationTo?: string | null;
    transportDestinationFrom?: string | null;
    transportRegNumber?: string | null;
    transportCubicCapacity?: number | string | null; // Allow string input
    transportAmount?: number | string | null; // Allow string input
    // Thesis/Project fields
    thesisType?: ThesisType | null;
    thesisSupervisionRank?: SupervisionRank | null;
    supervisedStudents?: { studentName: string; thesisTitle: string }[];
    thesisExamCourseCode?: string | null;
    thesisExamDate?: Date | null;
};

// --- React Component ---

export function CreateClaimForm() {
  const router = useRouter(); // Hook for programmatic navigation
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // State for loading indicator

  // Initialize react-hook-form without the complex Zod resolver for now
  const form = useForm<CreateClaimFormValues>({
    // resolver: zodResolver(CreateClaimSchema), // Temporarily removed
    defaultValues: { // Set initial form values
      claimType: undefined, // Start with no claim type selected
      description: "",
      teachingDate: undefined,
      teachingStartTime: "",
      teachingEndTime: "",
      teachingHours: "", // Keep as string initially for input binding
      transportType: undefined,
      transportDestinationTo: "",
      transportDestinationFrom: "",
      transportRegNumber: "",
      transportCubicCapacity: "", // Keep as string initially
      transportAmount: "", // Keep as string initially
      thesisType: undefined,
      thesisSupervisionRank: undefined,
      supervisedStudents: [],
      thesisExamCourseCode: "",
      thesisExamDate: undefined,
    },
  });

  // Watch specific form fields to dynamically render UI sections
  const selectedClaimType = form.watch("claimType");
  const selectedTransportType = form.watch("transportType");
  const selectedThesisType = form.watch("thesisType");

  // Hook for managing the dynamic array of supervised students
  const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({
    control: form.control, // Pass form control
    name: "supervisedStudents", // Specify the field name
  });

  // Function to add a new student row (up to a limit)
  const addStudent = () => {
    if (studentFields.length < 10) {
        appendStudent({ studentName: "", thesisTitle: "" }); // Append default values
    } else {
        toast.warning("Maximum of 10 supervised students reached."); // Show warning toast
    }
  };

  // --- Form Submission Handler ---
  async function onSubmit(values: CreateClaimFormValues) {
    setIsLoading(true); // Set loading state
    console.log("Submitting form values:", values); // Log raw form values

    // Basic check: Ensure a claim type is selected
    if (!values.claimType) {
        toast.error("Please select a claim type.");
        setIsLoading(false);
        return;
    }

    // Prepare data for the server action
    // The server action currently accepts 'unknown' and does minimal validation,
    // so we can pass the values relatively directly.
    // Perform necessary type conversions (e.g., string to number/Date) here if needed,
    // although the provided server action also does some basic conversion.
    const dataToSend = { ...values };

    try {
      // Call the server action to create the claim
      // The action expects 'unknown', so we pass the collected form values
      const result = await createClaim(dataToSend);

      // Handle success or failure based on the server action's response
      if (result.success) {
        toast.success(result.message || "Claim submitted successfully!");
        form.reset(); // Reset the form fields
        router.refresh(); // Refresh server components on the page
      } else {
        toast.error(result.message || "Failed to submit claim.");
        console.error("Server action failed:", result.message);
      }
    } catch (error) {
      // Catch unexpected errors during the submission process
      console.error("Create claim form submission error:", error);
      toast.error("An unexpected error occurred while submitting the claim.");
    } finally {
      // Always turn off loading state
      setIsLoading(false);
    }
  }

  // --- JSX Rendering ---
  return (
    // Use the Form provider from react-hook-form
    <Form {...form}>
      {/* Use native form element with RHF's handleSubmit */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Card 1: Select Claim Type */}
        <Card className="border-primary border-2">
            <CardHeader>
                <CardTitle>1. Select Claim Type</CardTitle>
                <CardDescription>Choose the category that best fits your claim.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Use Controller for integrating shadcn Select with RHF */}
                <Controller
                    control={form.control}
                    name="claimType"
                    rules={{ required: 'Claim type is required' }} // Add basic RHF required rule
                    render={({ field, fieldState: { error } }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Claim Type *</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value ?? undefined} // Handle undefined state
                                disabled={isLoading}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the type of claim..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* Use imported enum values directly */}
                                    <SelectItem value={ClaimType.TEACHING}>Teaching</SelectItem>
                                    <SelectItem value={ClaimType.TRANSPORTATION}>Transportation</SelectItem>
                                    <SelectItem value={ClaimType.THESIS_PROJECT}>Thesis / Project</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* Display RHF validation error */}
                            {error && <FormMessage>{error.message}</FormMessage>}
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        {/* Conditional Card 2: Claim Details */}
        {selectedClaimType && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {selectedClaimType === ClaimType.TEACHING && <BookOpen className="h-5 w-5" />}
                        {selectedClaimType === ClaimType.TRANSPORTATION && <Car className="h-5 w-5" />}
                        {selectedClaimType === ClaimType.THESIS_PROJECT && <GraduationCap className="h-5 w-5" />}
                        2. Enter {selectedClaimType.replace('_', ' ')} Details
                    </CardTitle>
                    <CardDescription>Provide the required information for your selected claim type.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">

                    {/* --- TEACHING FIELDS --- */}
                    {selectedClaimType === ClaimType.TEACHING && (
                    <div className="space-y-4">
                        {/* Date Picker - Use Controller */}
                        <Controller
                            control={form.control}
                            name="teachingDate"
                            rules={{ required: 'Teaching date is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Teaching *</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isLoading}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ?? undefined}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01") || isLoading}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                             )}
                        />
                        {/* Time Inputs & Hours - Use standard RHF register */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField name="teachingStartTime" control={form.control} rules={{ required: 'Start time is required', pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Invalid time (HH:MM)' } }} render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>Start Time *</FormLabel>
                                    <FormControl><Input type="time" {...field} disabled={isLoading} value={field.value ?? ''} /></FormControl>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                            )} />
                             <FormField name="teachingEndTime" control={form.control} rules={{ required: 'End time is required', pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Invalid time (HH:MM)' }, validate: (value) => (value ?? '') > (form.getValues('teachingStartTime') ?? '') || 'End time must be after start time' }} render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>End Time *</FormLabel>
                                    <FormControl><Input type="time" {...field} disabled={isLoading} value={field.value ?? ''} /></FormControl>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                            )} />
                            <FormField name="teachingHours" control={form.control} rules={{ pattern: { value: /^[0-9]*\.?[0-9]+$/, message: 'Must be a positive number' } }} render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>Contact Hours</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" placeholder="e.g., 2.5" {...field} disabled={isLoading} value={field.value ?? ''} />
                                    </FormControl>
                                     {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                            )} />
                        </div>
                    </div>
                    )}

                    {/* --- TRANSPORTATION FIELDS --- */}
                    {selectedClaimType === ClaimType.TRANSPORTATION && (
                    <div className="space-y-4">
                        {/* Transport Type Select - Use Controller */}
                        <Controller
                            control={form.control}
                            name="transportType"
                            rules={{ required: 'Transport type is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>Transport Type *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? undefined} disabled={isLoading}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select public or private..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value={TransportType.PUBLIC}>Public Transport</SelectItem>
                                            <SelectItem value={TransportType.PRIVATE}>Private Vehicle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                             )}
                        />
                         {/* Destination Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField name="transportDestinationFrom" control={form.control} rules={{ required: "Starting location is required" }} render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>From *</FormLabel>
                                    <FormControl><Input placeholder="Starting location" {...field} disabled={isLoading} value={field.value ?? ''}/></FormControl>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                            )} />
                             <FormField name="transportDestinationTo" control={form.control} rules={{ required: "Destination location is required" }} render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>To *</FormLabel>
                                    <FormControl><Input placeholder="Destination location" {...field} disabled={isLoading} value={field.value ?? ''}/></FormControl>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                            )} />
                        </div>
                        {/* Private Vehicle Specific Fields */}
                        {selectedTransportType === TransportType.PRIVATE && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <FormField name="transportRegNumber" control={form.control} rules={{ required: selectedTransportType === TransportType.PRIVATE ? "Vehicle registration is required" : false }} render={({ field, fieldState: { error } }) => (
                                    <FormItem>
                                        <FormLabel>Vehicle Reg. No. *</FormLabel>
                                        <FormControl><Input placeholder="e.g., GE 1234-25" {...field} disabled={isLoading} value={field.value ?? ''}/></FormControl>
                                        {error && <FormMessage>{error.message}</FormMessage>}
                                    </FormItem>
                                )} />
                                <FormField name="transportCubicCapacity" control={form.control} rules={{ required: selectedTransportType === TransportType.PRIVATE ? "Cubic capacity is required" : false, pattern: { value: /^\d+$/, message: 'Must be a whole number' } }} render={({ field, fieldState: { error } }) => (
                                    <FormItem>
                                        <FormLabel>Capacity (cc) *</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 1600" {...field} disabled={isLoading} value={field.value ?? ''}/></FormControl>
                                        {error && <FormMessage>{error.message}</FormMessage>}
                                    </FormItem>
                                )} />
                            </div>
                        )}
                        {/* Amount Claimed Input */}
                        <FormField name="transportAmount" control={form.control} rules={{ pattern: { value: /^[0-9]*\.?[0-9]+$/, message: 'Must be a positive number' } }} render={({ field, fieldState: { error } }) => (
                            <FormItem>
                                <FormLabel>Amount Claimed</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isLoading} value={field.value ?? ''}/>
                                </FormControl>
                                <FormDescription className="text-xs">Optional. Leave blank if calculated by policy.</FormDescription>
                                {error && <FormMessage>{error.message}</FormMessage>}
                            </FormItem>
                        )} />
                    </div>
                    )}

                    {/* --- THESIS/PROJECT FIELDS --- */}
                    {selectedClaimType === ClaimType.THESIS_PROJECT && (
                    <div className="space-y-4">
                        {/* Thesis Type Select - Use Controller */}
                        <Controller
                            control={form.control}
                            name="thesisType"
                            rules={{ required: 'Thesis/Project type is required' }}
                            render={({ field, fieldState: { error } }) => (
                                <FormItem>
                                    <FormLabel>Type *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? undefined} disabled={isLoading}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Supervision or Examination..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value={ThesisType.SUPERVISION}>Supervision</SelectItem>
                                            <SelectItem value={ThesisType.EXAMINATION}>Examination</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {error && <FormMessage>{error.message}</FormMessage>}
                                </FormItem>
                            )}
                        />

                        {/* Supervision Specific Fields */}
                        {selectedThesisType === ThesisType.SUPERVISION && (
                            <div className="space-y-4 pt-2 border-t mt-4">
                                {/* Supervision Rank Select - Use Controller */}
                                <Controller
                                    control={form.control}
                                    name="thesisSupervisionRank"
                                    rules={{ required: selectedThesisType === ThesisType.SUPERVISION ? 'Supervision rank is required' : false }}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormItem>
                                            <FormLabel>Supervision Rank *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value ?? undefined} disabled={isLoading}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select academic rank..." /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {Object.values(SupervisionRank).map(rank => (
                                                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {error && <FormMessage>{error.message}</FormMessage>}
                                        </FormItem>
                                    )}
                                />
                                {/* Supervised Students Array */}
                                <div className="space-y-3">
                                    <FormLabel>Supervised Students *</FormLabel>
                                    {/* Basic validation: ensure at least one student if supervision */}
                                     {studentFields.length === 0 && selectedThesisType === ThesisType.SUPERVISION && form.formState.isSubmitted && (
                                        <p className="text-sm font-medium text-destructive">At least one student is required for supervision.</p>
                                     )}
                                    {studentFields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-2 border p-3 rounded-md relative bg-background">
                                            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {/* Use register directly for nested fields */}
                                                <FormField name={`supervisedStudents.${index}.studentName`} control={form.control} rules={{ required: 'Student name is required' }} render={({ field: nestedField, fieldState: { error } }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-normal">Student Name {index + 1}</FormLabel>
                                                        <FormControl><Input placeholder="Student's full name" {...nestedField} disabled={isLoading} className="h-8 text-sm"/></FormControl>
                                                        {error && <FormMessage>{error.message}</FormMessage>}
                                                    </FormItem>
                                                )} />
                                                <FormField name={`supervisedStudents.${index}.thesisTitle`} control={form.control} rules={{ required: 'Thesis title is required' }} render={({ field: nestedField, fieldState: { error } }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-normal">Thesis/Project Title {index + 1}</FormLabel>
                                                        <FormControl><Input placeholder="Title of thesis/project" {...nestedField} disabled={isLoading} className="h-8 text-sm"/></FormControl>
                                                        {error && <FormMessage>{error.message}</FormMessage>}
                                                    </FormItem>
                                                )} />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStudent(index)} disabled={isLoading} className="mt-5 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 flex-shrink-0" aria-label={`Remove student ${index + 1}`}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addStudent} disabled={isLoading || studentFields.length >= 10} className="mt-2">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Student Row
                                    </Button>
                                     {/* Display max students error */}
                                     {studentFields.length >= 10 && (
                                        <p className="text-sm font-medium text-destructive">Maximum of 10 students reached.</p>
                                     )}
                                </div>
                            </div>
                        )}

                        {/* Examination Specific Fields */}
                        {selectedThesisType === ThesisType.EXAMINATION && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t mt-4">
                                <FormField name="thesisExamCourseCode" control={form.control} rules={{ required: selectedThesisType === ThesisType.EXAMINATION ? 'Course code is required' : false }} render={({ field, fieldState: { error } }) => (
                                    <FormItem>
                                        <FormLabel>Course Code *</FormLabel>
                                        <FormControl><Input placeholder="e.g., CS499" {...field} disabled={isLoading} value={field.value ?? ''}/></FormControl>
                                        {error && <FormMessage>{error.message}</FormMessage>}
                                    </FormItem>
                                )} />
                                {/* Date Picker - Use Controller */}
                                <Controller
                                    control={form.control}
                                    name="thesisExamDate"
                                    rules={{ required: selectedThesisType === ThesisType.EXAMINATION ? 'Examination date is required' : false }}
                                    render={({ field, fieldState: { error } }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Examination *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isLoading}>
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ?? undefined}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01") || isLoading}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {error && <FormMessage>{error.message}</FormMessage>}
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                    )}

                    {/* --- General Description Field (Common to all types) --- */}
                    <FormField name="description" control={form.control} render={({ field }) => (
                        <FormItem className="pt-4 border-t">
                            <FormLabel>General Description / Notes (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add any relevant notes or general description for this claim..." className="resize-y min-h-[80px]" {...field} disabled={isLoading} value={field.value ?? ''}/>
                            </FormControl>
                            {/* No message needed for optional field unless specific validation added */}
                        </FormItem>
                    )} />

                </CardContent>
            </Card>
        )}

        {/* Submit Button Area */}
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading || !selectedClaimType}>
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
