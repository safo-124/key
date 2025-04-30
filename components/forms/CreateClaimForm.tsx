"use client"; // Mark as Client Component

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form"; // Form management hooks
import * as z from "zod"; // Still useful for basic client checks if needed
import { zodResolver } from "@hookform/resolvers/zod"; // For basic validation
import { format } from "date-fns"; // Date formatting
import { CalendarIcon, Loader2, Send, PlusCircle, Trash2, BookOpen, Car, GraduationCap } from "lucide-react"; // Icons
import { useRouter } from 'next/navigation'; // Navigation hook

// Import shadcn/ui components
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
import { toast } from "sonner"; // Notifications
import { cn } from "@/lib/utils"; // Utility for conditional classes

// Import Prisma enums and server action
import { ClaimType, TransportType, ThesisType, SupervisionRank } from "@prisma/client";
import { createClaim } from "@/lib/actions/lecturer.actions"; // Import the *same* server action

// --- Simplified Client-Side Validation ---
// We only validate the claim type initially. Specific field validation
// will primarily rely on the server action's more robust schema.
const SimpleBaseSchema = z.object({
    claimType: z.nativeEnum(ClaimType, { required_error: "Please select a claim type." }),
    // We include all possible fields here but make them optional at this stage
    // Server-side validation will enforce requirements based on claimType
    description: z.string().max(1000).optional(),
    teachingDate: z.date().optional().nullable(),
    teachingStartTime: z.string().optional().nullable(),
    teachingEndTime: z.string().optional().nullable(),
    teachingHours: z.coerce.number().optional().nullable(),
    transportType: z.nativeEnum(TransportType).optional().nullable(),
    transportDestinationTo: z.string().optional().nullable(),
    transportDestinationFrom: z.string().optional().nullable(),
    transportRegNumber: z.string().optional().nullable(),
    transportCubicCapacity: z.coerce.number().optional().nullable(),
    transportAmount: z.coerce.number().optional().nullable(),
    thesisType: z.nativeEnum(ThesisType).optional().nullable(),
    thesisSupervisionRank: z.nativeEnum(SupervisionRank).optional().nullable(),
    supervisedStudents: z.array(z.object({
        studentName: z.string().min(1).max(191),
        thesisTitle: z.string().min(1).max(255),
    })).max(10).optional(),
    thesisExamCourseCode: z.string().optional().nullable(),
    thesisExamDate: z.coerce.date().optional().nullable(),
});

type SimpleFormValues = z.infer<typeof SimpleBaseSchema>;

// --- CreateClaimForm Component ---
export function CreateClaimForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Initialize react-hook-form with the simplified schema
  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(SimpleBaseSchema), // Use the simple base schema
    defaultValues: { // Set defaults for all possible fields
      claimType: undefined,
      description: "",
      teachingDate: undefined, teachingStartTime: "", teachingEndTime: "", teachingHours: undefined,
      transportType: undefined, transportDestinationTo: "", transportDestinationFrom: "", transportRegNumber: "", transportCubicCapacity: undefined, transportAmount: undefined,
      thesisType: undefined, thesisSupervisionRank: undefined, supervisedStudents: [], thesisExamCourseCode: "", thesisExamDate: undefined,
    },
  });

  // Watch the claimType field to conditionally render sections
  const selectedClaimType = form.watch("claimType");
  const selectedTransportType = form.watch("transportType");
  const selectedThesisType = form.watch("thesisType");

  // Hook for managing the supervised students array
  const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({
    control: form.control, name: "supervisedStudents",
  });

  // Add a new blank student entry
  const addStudent = () => {
    if (studentFields.length < 10) { appendStudent({ studentName: "", thesisTitle: "" }); }
    else { toast.warning("Maximum of 10 supervised students reached."); }
  };

  // Handle form submission
  async function onSubmit(values: SimpleFormValues) {
    setIsLoading(true);
    console.log("Submitting claim (simplified form):", values);

    // Prepare data payload - include only fields relevant to the selected type
    // The server action will perform the strict validation based on claimType
    let payload: any = { claimType: values.claimType, description: values.description };

    switch (values.claimType) {
        case ClaimType.TEACHING:
            payload = {
                ...payload,
                teachingDate: values.teachingDate,
                teachingStartTime: values.teachingStartTime,
                teachingEndTime: values.teachingEndTime,
                teachingHours: values.teachingHours === '' ? null : Number(values.teachingHours),
            };
            break;
        case ClaimType.TRANSPORTATION:
            payload = {
                ...payload,
                transportType: values.transportType,
                transportDestinationTo: values.transportDestinationTo,
                transportDestinationFrom: values.transportDestinationFrom,
                transportRegNumber: values.transportType === TransportType.PRIVATE ? values.transportRegNumber : null,
                transportCubicCapacity: values.transportType === TransportType.PRIVATE ? (values.transportCubicCapacity === '' ? null : Number(values.transportCubicCapacity)) : null,
                transportAmount: values.transportAmount === '' ? null : Number(values.transportAmount),
            };
            break;
        case ClaimType.THESIS_PROJECT:
             payload = {
                ...payload,
                thesisType: values.thesisType,
                thesisSupervisionRank: values.thesisType === ThesisType.SUPERVISION ? values.thesisSupervisionRank : null,
                supervisedStudents: values.thesisType === ThesisType.SUPERVISION ? values.supervisedStudents : [],
                thesisExamCourseCode: values.thesisType === ThesisType.EXAMINATION ? values.thesisExamCourseCode : null,
                thesisExamDate: values.thesisType === ThesisType.EXAMINATION ? values.thesisExamDate : null,
            };
            break;
    }


    try {
      // Call the *same* server action. It handles the complex validation.
      const result = await createClaim(payload);

      if (result.success) {
        toast.success(result.message || "Claim submitted successfully!");
        form.reset(); // Reset form on success
        router.refresh(); // Refresh server data for the current route
      } else {
        // Display error from server action (which performed the detailed validation)
        toast.error(result.message || "Failed to submit claim. Please check the fields.");
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

        {/* Card 1: Claim Type Selection */}
        <Card className="border-primary border-2">
            <CardHeader>
                <CardTitle>1. Select Claim Type</CardTitle>
                <CardDescription>Choose the category that best fits your claim.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="claimType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="sr-only">Claim Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select the type of claim..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value={ClaimType.TEACHING}>Teaching</SelectItem>
                        <SelectItem value={ClaimType.TRANSPORTATION}>Transportation</SelectItem>
                        <SelectItem value={ClaimType.THESIS_PROJECT}>Thesis / Project</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

        {/* Card 2: Type-Specific Details (Conditional) */}
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

                    {/* --- TEACHING Section --- */}
                    {selectedClaimType === ClaimType.TEACHING && (
                    <div className="space-y-4">
                        <FormField control={form.control} name="teachingDate" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Date of Teaching *</FormLabel> <Popover> <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isLoading}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01") || isLoading} initialFocus /></PopoverContent> </Popover> <FormMessage /> </FormItem> )} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField control={form.control} name="teachingStartTime" render={({ field }) => (<FormItem><FormLabel>Start Time *</FormLabel><FormControl><Input type="time" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="teachingEndTime" render={({ field }) => (<FormItem><FormLabel>End Time *</FormLabel><FormControl><Input type="time" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="teachingHours" render={({ field }) => (<FormItem><FormLabel>Contact Hours</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 2.5" {...field} onChange={event => field.onChange(event.target.value === '' ? null : Number(event.target.value))} value={field.value ?? ''} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                    )}

                    {/* --- TRANSPORTATION Section --- */}
                    {selectedClaimType === ClaimType.TRANSPORTATION && (
                    <div className="space-y-4">
                        <FormField control={form.control} name="transportType" render={({ field }) => (<FormItem><FormLabel>Transport Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}><FormControl><SelectTrigger><SelectValue placeholder="Select public or private..." /></SelectTrigger></FormControl><SelectContent><SelectItem value={TransportType.PUBLIC}>Public Transport</SelectItem><SelectItem value={TransportType.PRIVATE}>Private Vehicle</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="transportDestinationFrom" render={({ field }) => (<FormItem><FormLabel>From *</FormLabel><FormControl><Input placeholder="Starting location" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="transportDestinationTo" render={({ field }) => (<FormItem><FormLabel>To *</FormLabel><FormControl><Input placeholder="Destination location" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        {selectedTransportType === TransportType.PRIVATE && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <FormField control={form.control} name="transportRegNumber" render={({ field }) => (<FormItem><FormLabel>Vehicle Reg. No. *</FormLabel><FormControl><Input placeholder="e.g., GE 1234-25" {...field} value={field.value ?? ''} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="transportCubicCapacity" render={({ field }) => (<FormItem><FormLabel>Capacity (cc) *</FormLabel><FormControl><Input type="number" placeholder="e.g., 1600" {...field} onChange={event => field.onChange(event.target.value === '' ? null : parseInt(event.target.value, 10))} value={field.value ?? ''} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        )}
                        <FormField control={form.control} name="transportAmount" render={({ field }) => (<FormItem><FormLabel>Amount Claimed</FormLabel><FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={event => field.onChange(event.target.value === '' ? null : Number(event.target.value))} value={field.value ?? ''} disabled={isLoading} /></FormControl><FormDescription className="text-xs">Optional.</FormDescription><FormMessage /></FormItem>)} />
                    </div>
                    )}

                    {/* --- THESIS/PROJECT Section --- */}
                    {selectedClaimType === ClaimType.THESIS_PROJECT && (
                    <div className="space-y-4">
                        <FormField control={form.control} name="thesisType" render={({ field }) => (<FormItem><FormLabel>Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}><FormControl><SelectTrigger><SelectValue placeholder="Select Supervision or Examination..." /></SelectTrigger></FormControl><SelectContent><SelectItem value={ThesisType.SUPERVISION}>Supervision</SelectItem><SelectItem value={ThesisType.EXAMINATION}>Examination</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        {/* Supervision Fields */}
                        {selectedThesisType === ThesisType.SUPERVISION && (
                            <div className="space-y-4 pt-2 border-t mt-4">
                                <FormField control={form.control} name="thesisSupervisionRank" render={({ field }) => (<FormItem><FormLabel>Supervision Rank *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value ?? undefined} disabled={isLoading}><FormControl><SelectTrigger><SelectValue placeholder="Select academic rank..." /></SelectTrigger></FormControl><SelectContent>{Object.values(SupervisionRank).map(rank => (<SelectItem key={rank} value={rank}>{rank}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                                <div className="space-y-3">
                                    <FormLabel>Supervised Students (Max 10) *</FormLabel>
                                    {studentFields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-2 border p-3 rounded-md relative bg-background">
                                            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <FormField control={form.control} name={`supervisedStudents.${index}.studentName`} render={({ field }) => (<FormItem><FormLabel className="text-xs font-normal">Student Name {index + 1}</FormLabel><FormControl><Input placeholder="Student's full name" {...field} disabled={isLoading} className="h-8 text-sm"/></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name={`supervisedStudents.${index}.thesisTitle`} render={({ field }) => (<FormItem><FormLabel className="text-xs font-normal">Thesis/Project Title {index + 1}</FormLabel><FormControl><Input placeholder="Title of thesis/project" {...field} disabled={isLoading} className="h-8 text-sm"/></FormControl><FormMessage /></FormItem>)} />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStudent(index)} disabled={isLoading} className="mt-5 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 flex-shrink-0" aria-label={`Remove student ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addStudent} disabled={isLoading || studentFields.length >= 10} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> Add Student Row</Button>
                                    {/* Display validation error for the array itself */}
                                    {form.formState.errors.supervisedStudents && !form.formState.errors.supervisedStudents.root && studentFields.length === 0 && (<p className="text-sm font-medium text-destructive">At least one student is required for supervision.</p>)}
                                    {form.formState.errors.supervisedStudents?.root && (<p className="text-sm font-medium text-destructive">{form.formState.errors.supervisedStudents.root.message}</p>)}
                                </div>
                            </div>
                        )}
                        {/* Examination Fields */}
                        {selectedThesisType === ThesisType.EXAMINATION && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t mt-4">
                                <FormField control={form.control} name="thesisExamCourseCode" render={({ field }) => (<FormItem><FormLabel>Course Code *</FormLabel><FormControl><Input placeholder="e.g., CS499" {...field} value={field.value ?? ''} disabled={isLoading} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="thesisExamDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Examination *</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isLoading}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01") || isLoading} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                            </div>
                        )}
                    </div>
                    )}

                    {/* Optional General Description Field */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="pt-4 border-t">
                            <FormLabel>General Description / Notes (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add any relevant notes or general description for this claim..." className="resize-y min-h-[80px]" {...field} value={field.value ?? ''} disabled={isLoading}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                </CardContent>
            </Card>
        )}


        {/* Submit Button */}
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
