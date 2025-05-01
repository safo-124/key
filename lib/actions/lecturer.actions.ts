"use server"; // Directive MUST be the very first line

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUserSession } from "@/lib/auth";
import { Role, ClaimStatus, ClaimType } from "@prisma/client"; // Import necessary enums

// --- Define ActionResult Type Locally ---
type ActionResult = {
  success: boolean;
  message?: string;
  claimId?: string;
};
// --- ---

// --- Simplified Validation Schema for Debugging ---
// Only validates the claim type exists and optional description
const DebugCreateClaimSchema = z.object({
    claimType: z.nativeEnum(ClaimType, { required_error: "Claim type is required."}),
    description: z.string().max(1000).optional(),
    // We ignore other fields for this test
});

// --- Create Claim Server Action (Using Simplified Schema) ---
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

    // 3. Validate Input Data using the *Simplified* Schema
    const validatedFields = DebugCreateClaimSchema.safeParse(values);
    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        console.warn("Simplified Claim creation validation failed:", validatedFields.error.flatten());
        // Return a generic message as specific fields aren't validated here
        return { success: false, message: "Invalid basic data provided." };
    }
    // We only get claimType and description from this validation
    const { claimType, description } = validatedFields.data;
    // We need to cast 'values' to get the other fields, assuming they exist
    // THIS IS UNSAFE FOR PRODUCTION but okay for debugging the Zod error
    const unsafeValues = values as any;

    console.log(`Lecturer Action (Debug): Attempting to create ${claimType} claim for center ${centerId} by user ${session.userId}`);
    console.log("DEBUG: Received unsafeValues:", unsafeValues); // Log the raw values

    try {
        // 4. Create the claim record 
        // WARNING: This bypasses detailed validation for debugging purposes only.
        const newClaim = await prisma.claim.create({
            data: {
                claimType: claimType,
                status: ClaimStatus.PENDING,
                submittedById: session.userId,
                centerId: centerId,
                // Add other fields directly from unsafeValues - **NOT RECOMMENDED FOR PRODUCTION**
                teachingDate: unsafeValues.teachingDate ? new Date(unsafeValues.teachingDate) : null,
                teachingStartTime: unsafeValues.teachingStartTime || null,
                teachingEndTime: unsafeValues.teachingEndTime || null,
                teachingHours: unsafeValues.teachingHours ? Number(unsafeValues.teachingHours) : null,
                transportType: unsafeValues.transportType || null,
                transportDestinationTo: unsafeValues.transportDestinationTo || null,
                transportDestinationFrom: unsafeValues.transportDestinationFrom || null,
                transportRegNumber: unsafeValues.transportRegNumber || null,
                transportCubicCapacity: unsafeValues.transportCubicCapacity ? parseInt(unsafeValues.transportCubicCapacity, 10) : null,
                transportAmount: unsafeValues.transportAmount ? Number(unsafeValues.transportAmount) : null,
                thesisType: unsafeValues.thesisType || null,
                thesisSupervisionRank: unsafeValues.thesisSupervisionRank || null,
                thesisExamCourseCode: unsafeValues.thesisExamCourseCode || null,
                thesisExamDate: unsafeValues.thesisExamDate ? new Date(unsafeValues.thesisExamDate) : null,
                // Supervised students would need separate handling even in debug
            },
        });

         // Handle supervised students separately if needed for debugging
         if (claimType === ClaimType.THESIS_PROJECT && unsafeValues.thesisType === 'SUPERVISION' && Array.isArray(unsafeValues.supervisedStudents)) {
             // Simplified creation - assumes data is correct for debug
             await prisma.supervisedStudent.createMany({
                 data: unsafeValues.supervisedStudents.map((s: any) => ({
                     studentName: s.studentName || 'Unknown',
                     thesisTitle: s.thesisTitle || 'Unknown',
                     claimId: newClaim.id,
                     supervisorId: session.userId,
                 }))
             });
         }


        console.log(`Lecturer Action (Debug): Successfully created claim ${newClaim.id}`);

        // 5. Revalidate Paths
        try {
            revalidatePath(`/lecturer/${centerId}/claims`);
            revalidatePath(`/coordinator/${centerId}/claims`);
            revalidatePath(`/dashboard`);
        } catch (revalidateError) {
             console.error("Error during path revalidation:", revalidateError);
        }

        // 6. Return Success
        return {
            success: true,
            message: `Claim submitted successfully (DEBUG MODE).`,
            claimId: newClaim.id,
        };

    } catch (error) {
        console.error("Create Claim Action Database Error (Debug):", error);
        return { success: false, message: "An internal error occurred while submitting the claim (DEBUG MODE)." };
    }
}

// --- TODO: Add actions for viewing/editing/deleting claims ---
