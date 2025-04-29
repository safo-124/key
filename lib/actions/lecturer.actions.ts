"use server"; // Directive must be the very first line to mark this file for Server Actions

import { z } from "zod"; // Library for data validation
import { revalidatePath } from "next/cache"; // Function to invalidate Next.js cache for specific paths
import { Prisma } from "@prisma/client"; // Import Prisma types for error handling, etc.

import prisma from "@/lib/prisma"; // Import the configured Prisma Client instance
import { getCurrentUserSession } from "@/lib/auth"; // Helper function to get current user session details
import { Role, ClaimStatus } from "@prisma/client"; // Import Prisma enums

// --- Define ActionResult Type Locally ---
// Standardized return type for actions in this file, indicating success/failure and providing messages/data.
type ActionResult = {
  success: boolean; // True if the action completed successfully, false otherwise
  message?: string; // Optional user-friendly message (e.g., success confirmation or error description)
  claimId?: string; // Optionally return the ID of the newly created or affected claim
  // Add other relevant return data if needed for specific actions
};
// --- ---


// --- Validation Schema ---
// Define the structure and validation rules for data expected when creating a claim.
const CreateClaimSchema = z.object({
  // Title is required, must be a string between 3 and 150 characters.
  title: z.string().min(3, "Title must be at least 3 characters.").max(150, "Title cannot exceed 150 characters."),
  // Description is optional, but if provided, must be a string no longer than 1000 characters.
  description: z.string().max(1000, "Description cannot exceed 1000 characters.").optional(),
  // Amount is required. Use coerce to attempt conversion from string (common from forms) to number.
  amount: z.coerce
    .number({
        required_error: "Amount is required.", // Error if missing
        invalid_type_error: "Amount must be a number." // Error if not parseable as number
    })
    .positive({ message: "Amount must be a positive number." }) // Ensure amount is greater than 0
    .finite({ message: "Amount must be a valid number."}), // Ensure it's not Infinity or NaN
  // Note: centerId and submittedById are not included here as they are determined on the server from the user's session/context.
});


// --- Create Claim Server Action ---
/**
 * Creates a new claim submitted by the logged-in lecturer for their assigned center.
 * This function runs only on the server.
 * @param values - Input data from the claim creation form, expected to match CreateClaimSchema (title, description, amount).
 * @returns Promise<ActionResult> - An object indicating the success or failure of the operation, with messages.
 */
export async function createClaim(values: unknown): Promise<ActionResult> {
    // 1. Verify User Role and Session
    // Get the current user's session details.
    const session = getCurrentUserSession();
    // Ensure a user is logged in and has the LECTURER role.
    if (session?.role !== Role.LECTURER) {
        return { success: false, message: "Unauthorized: Only Lecturers can create claims." };
    }

    // 2. Get Lecturer's Center Assignment
    // Fetch the lecturer's details again server-side to ensure we have the correct, current center assignment.
    // This prevents potential issues if the assignment changed since the page loaded.
    let centerId: string;
    try {
        const lecturerDetails = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { lecturerCenterId: true } // Select only the necessary field
        });

        // Check if the lecturer is assigned to a center.
        if (!lecturerDetails?.lecturerCenterId) {
            return { success: false, message: "Cannot create claim: You are not assigned to a center." };
        }
        centerId = lecturerDetails.lecturerCenterId; // Store the assigned center ID
    } catch (dbError) {
         console.error("Database error fetching lecturer assignment:", dbError);
         return { success: false, message: "Error verifying your center assignment." };
    }


    // 3. Validate Input Data
    // Parse and validate the incoming form data against the Zod schema.
    const validatedFields = CreateClaimSchema.safeParse(values);
    // If validation fails, return an error message.
    if (!validatedFields.success) {
        // Extract the first validation error message to show the user.
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        console.warn("Claim creation validation failed:", validatedFields.error.flatten());
        return { success: false, message: firstError || "Invalid data provided. Please check the form fields." };
    }
    // Destructure the validated data for use.
    const { title, description, amount } = validatedFields.data;

    console.log(`Lecturer Action: Attempting to create claim "${title}" for center ${centerId} by user ${session.userId}`);

    try {
        // 4. Create the Claim Record in the Database
        const newClaim = await prisma.claim.create({
            data: {
                title,
                description: description || null, // Use the provided description, or null if empty/undefined
                amount, // The validated and coerced amount
                status: ClaimStatus.PENDING, // Set the initial status to PENDING
                submittedById: session.userId, // Link the claim to the logged-in lecturer
                centerId: centerId, // Link the claim to the lecturer's assigned center
                // processedById and processedAt remain null until a coordinator takes action
            },
        });

        console.log(`Lecturer Action: Successfully created claim ${newClaim.id}`);

        // 5. Revalidate Cached Paths
        // Invalidate the cache for pages that display claim lists, ensuring they show the new claim.
        try {
            revalidatePath(`/lecturer/${centerId}/claims`); // Lecturer's own claims list for this center
            revalidatePath(`/coordinator/${centerId}/claims`); // Coordinator's claims list for this center
            revalidatePath(`/dashboard`); // Main dashboard (if it shows claim summaries/counts)
            console.log(`Revalidated paths after claim creation: /lecturer/${centerId}/claims, /coordinator/${centerId}/claims, /dashboard`);
        } catch (revalidateError) {
             // Log revalidation errors but don't necessarily fail the whole operation
             console.error("Error during path revalidation:", revalidateError);
        }


        // 6. Return Success Response
        return {
            success: true,
            message: `Claim "${newClaim.title}" submitted successfully.`,
            claimId: newClaim.id, // Return the ID of the newly created claim
        };

    } catch (error) {
        // Handle potential errors during database interaction.
        console.error("Create Claim Action Database Error:", error);
        // Provide a generic error message to the user.
        return { success: false, message: "An internal error occurred while submitting the claim. Please try again." };
    }
}

// --- TODO: Add actions for viewing lecturer's own claims (if needed beyond page fetches) ---
// --- TODO: Add actions for potentially editing/deleting PENDING claims by the lecturer ---
