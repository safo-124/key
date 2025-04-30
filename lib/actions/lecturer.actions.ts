"use server"; // Directive MUST be the very first line

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUserSession } from "@/lib/auth";
import { Role, ClaimStatus, ClaimType, TransportType, ThesisType, SupervisionRank } from "@prisma/client";

// --- Define ActionResult Type Locally ---
type ActionResult = {
  success: boolean;
  message?: string;
  claimId?: string;
};
// --- ---

// --- Validation Schemas for Complex Claims ---

const SupervisedStudentSchema = z.object({
    studentName: z.string().min(1, "Student name is required.").max(191),
    thesisTitle: z.string().min(1, "Thesis title is required.").max(255),
});

const BaseClaimSchema = z.object({
    claimType: z.nativeEnum(ClaimType),
});

const TeachingClaimSchema = BaseClaimSchema.extend({
    claimType: z.literal(ClaimType.TEACHING),
    teachingDate: z.coerce.date({ required_error: "Teaching date is required." }),
    teachingStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time (HH:MM)."),
    teachingEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time (HH:MM)."),
    teachingHours: z.coerce.number().positive("Contact hours must be positive.").optional().nullable(),
    description: z.string().max(1000).optional(), // Optional description added here
}).refine(data => data.teachingEndTime > data.teachingStartTime, {
    message: "End time must be after start time.", path: ["teachingEndTime"]
});

const TransportationClaimSchema = BaseClaimSchema.extend({
    claimType: z.literal(ClaimType.TRANSPORTATION),
    transportType: z.nativeEnum(TransportType, { required_error: "Transport type is required." }),
    transportDestinationTo: z.string().min(1, "Destination 'To' is required.").max(191),
    transportDestinationFrom: z.string().min(1, "Destination 'From' is required.").max(191),
    transportRegNumber: z.string().max(50).optional().nullable(),
    transportCubicCapacity: z.coerce.number().int("Capacity must be a whole number.").positive("Capacity must be positive.").optional().nullable(),
    transportAmount: z.coerce.number().positive("Amount claimed must be positive.").optional().nullable(),
    description: z.string().max(1000).optional(),
}).refine(data => (data.transportType === TransportType.PRIVATE ? data.transportRegNumber && data.transportRegNumber.trim() !== '' : true), {
    message: "Registration number is required for private transport.", path: ["transportRegNumber"],
}).refine(data => (data.transportType === TransportType.PRIVATE ? data.transportCubicCapacity !== null && data.transportCubicCapacity !== undefined : true), {
    message: "Cubic capacity is required for private transport.", path: ["transportCubicCapacity"],
});

const ThesisProjectClaimSchema = BaseClaimSchema.extend({
    claimType: z.literal(ClaimType.THESIS_PROJECT),
    thesisType: z.nativeEnum(ThesisType, { required_error: "Thesis/Project type is required." }),
    thesisSupervisionRank: z.nativeEnum(SupervisionRank).optional().nullable(),
    supervisedStudents: z.array(SupervisedStudentSchema).max(10, "Max 10 students.").optional(),
    thesisExamCourseCode: z.string().max(50).optional().nullable(),
    thesisExamDate: z.coerce.date().optional().nullable(),
    description: z.string().max(1000).optional(),
}).refine(data => (data.thesisType === ThesisType.SUPERVISION ? !!data.thesisSupervisionRank : true), {
    message: "Supervision rank is required.", path: ["thesisSupervisionRank"],
}).refine(data => (data.thesisType === ThesisType.SUPERVISION ? data.supervisedStudents && data.supervisedStudents.length > 0 : true), {
    message: "At least one student is required for supervision.", path: ["supervisedStudents"],
}).refine(data => (data.thesisType === ThesisType.EXAMINATION ? !!data.thesisExamCourseCode && data.thesisExamCourseCode.trim() !== '' : true), {
    message: "Course code is required for examination.", path: ["thesisExamCourseCode"],
}).refine(data => (data.thesisType === ThesisType.EXAMINATION ? !!data.thesisExamDate : true), {
    message: "Examination date is required.", path: ["thesisExamDate"],
});

// Discriminated union for overall claim validation
const CreateClaimSchema = z.discriminatedUnion("claimType", [
    TeachingClaimSchema,
    TransportationClaimSchema,
    ThesisProjectClaimSchema
], {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
            return { message: 'Invalid claim type selected.' };
        }
        return { message: ctx.defaultError };
    }
});


// --- Create Claim Server Action (UPDATED) ---
/**
 * Creates a new claim with type-specific data submitted by the logged-in lecturer.
 * @param values - Input data matching one of the specific claim schemas.
 * @returns ActionResult indicating success or failure.
 */
export async function createClaim(values: unknown): Promise<ActionResult> {
    // 1. Verify User Role and Session
    const session = getCurrentUserSession();
    if (session?.role !== Role.LECTURER) {
        return { success: false, message: "Unauthorized: Only Lecturers can create claims." };
    }

    // 2. Get Lecturer's Center Assignment
    let centerId: string;
    try {
        const lecturerDetails = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { lecturerCenterId: true }
        });
        if (!lecturerDetails?.lecturerCenterId) {
            return { success: false, message: "Cannot create claim: You are not assigned to a center." };
        }
        centerId = lecturerDetails.lecturerCenterId;
    } catch (dbError) {
         console.error("Database error fetching lecturer assignment:", dbError);
         return { success: false, message: "Error verifying your center assignment." };
    }

    // 3. Validate Input Data using the Discriminated Union Schema
    const validatedFields = CreateClaimSchema.safeParse(values);
    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        console.warn("Claim creation validation failed:", validatedFields.error.flatten());
        return { success: false, message: firstError || "Invalid data provided. Please check the form fields." };
    }
    const claimData = validatedFields.data; // Validated data, type depends on claimType

    console.log(`Lecturer Action: Attempting to create ${claimData.claimType} claim for center ${centerId} by user ${session.userId}`);

    try {
        // 4. Prepare data for Prisma create based on claim type
        const commonData = {
            claimType: claimData.claimType,
            status: ClaimStatus.PENDING,
            submittedById: session.userId,
            centerId: centerId,
            description: claimData.description || null, // Add common description field
        };

        let prismaCreateData: Prisma.ClaimCreateInput;

        switch (claimData.claimType) {
            case ClaimType.TEACHING:
                prismaCreateData = {
                    ...commonData,
                    teachingDate: claimData.teachingDate,
                    teachingStartTime: claimData.teachingStartTime,
                    teachingEndTime: claimData.teachingEndTime,
                    teachingHours: claimData.teachingHours,
                };
                break;

            case ClaimType.TRANSPORTATION:
                prismaCreateData = {
                    ...commonData,
                    transportType: claimData.transportType,
                    transportDestinationTo: claimData.transportDestinationTo,
                    transportDestinationFrom: claimData.transportDestinationFrom,
                    transportRegNumber: claimData.transportType === TransportType.PRIVATE ? claimData.transportRegNumber : null,
                    transportCubicCapacity: claimData.transportType === TransportType.PRIVATE ? claimData.transportCubicCapacity : null,
                    transportAmount: claimData.transportAmount,
                };
                break;

            case ClaimType.THESIS_PROJECT:
                prismaCreateData = {
                    ...commonData,
                    thesisType: claimData.thesisType,
                    thesisSupervisionRank: claimData.thesisType === ThesisType.SUPERVISION ? claimData.thesisSupervisionRank : null,
                    thesisExamCourseCode: claimData.thesisType === ThesisType.EXAMINATION ? claimData.thesisExamCourseCode : null,
                    thesisExamDate: claimData.thesisType === ThesisType.EXAMINATION ? claimData.thesisExamDate : null,
                    // Supervised students handled in transaction below if type is SUPERVISION
                };
                break;

            // No default needed as Zod validation ensures claimType is valid
        }

        // 5. Create Claim and potentially related records (SupervisedStudent) in a transaction
        const newClaim = await prisma.$transaction(async (tx) => {
            const createdClaim = await tx.claim.create({ data: prismaCreateData });

            if (claimData.claimType === ClaimType.THESIS_PROJECT && claimData.thesisType === ThesisType.SUPERVISION && claimData.supervisedStudents) {
                if (claimData.supervisedStudents.length > 0) {
                    await tx.supervisedStudent.createMany({
                        data: claimData.supervisedStudents.map(student => ({
                            studentName: student.studentName,
                            thesisTitle: student.thesisTitle,
                            claimId: createdClaim.id,
                            supervisorId: session.userId,
                        })),
                    });
                }
            }
            return createdClaim;
        });


        console.log(`Lecturer Action: Successfully created ${newClaim.claimType} claim ${newClaim.id}`);

        // 6. Revalidate Cached Paths
        try {
            revalidatePath(`/lecturer/${centerId}/claims`);
            revalidatePath(`/lecturer/${centerId}/claims/${newClaim.id}`);
            revalidatePath(`/coordinator/${centerId}/claims`);
            revalidatePath(`/dashboard`);
            console.log(`Revalidated paths after claim creation.`);
        } catch (revalidateError) {
             console.error("Error during path revalidation:", revalidateError);
        }

        // 7. Return Success Response
        return {
            success: true,
            message: `Claim submitted successfully.`,
            claimId: newClaim.id,
        };

    } catch (error) {
        console.error("Create Claim Action Database Error:", error);
        return { success: false, message: "An internal error occurred while submitting the claim. Please try again." };
    }
}

// --- TODO: Add actions for viewing lecturer's own claims (if needed beyond simple page fetches) ---
// --- TODO: Add actions for potentially editing/deleting PENDING claims by the lecturer ---
// --- TODO: Add actions for potentially withdrawing submitted claims ---
