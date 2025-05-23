"use server"; // Mark this file for server-side execution only

import { z } from "zod"; // For data validation
import { revalidatePath } from "next/cache"; // For cache invalidation after mutations
import { Prisma, ClaimStatus } from "@prisma/client"; // Import Prisma types and enums
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing passwords

import prisma from "@/lib/prisma"; // Import the configured Prisma Client instance
import { getCurrentUserSession } from "@/lib/auth"; // Import helper to get current user session
import { Role, TransportType, ThesisType } from "@prisma/client"; // Import necessary enums

// --- Define ActionResult Type Locally ---
// Standardized return type for actions in this file
type ActionResult = {
  success: boolean; // Indicates if the action was successful
  message?: string; // Provides a user-friendly message (success or error)
  userId?: string;   // Optionally return the ID of the affected user
  departmentId?: string; // Optionally return the ID of the affected department
  claimId?: string; // Optionally return the ID of the affected claim
  // Add other relevant return data if needed for specific actions
};
// --- ---


// --- Validation Schemas ---

// Schema for creating/updating a department by a Coordinator
const DepartmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name cannot exceed 100 characters."),
  centerId: z.string().cuid("Invalid Center ID."), // Included for validation and passing data
});

// Schema for deleting a department by a Coordinator
const DeleteDepartmentSchema = z.object({
  departmentId: z.string().cuid("Invalid Department ID."),
  centerId: z.string().cuid("Invalid Center ID."), // Include centerId for authorization check
});

// Schema for assigning a lecturer to a department by a Coordinator
const AssignLecturerDepartmentSchema = z.object({
    departmentId: z.string().cuid("Invalid Department ID."),
    lecturerId: z.string().cuid("Invalid Lecturer ID."),
    centerId: z.string().cuid("Invalid Center ID."), // For authorization check
});

// Schema for creating a new lecturer by a Coordinator for their specific center
const CreateLecturerSchema = z.object({
  centerId: z.string().cuid("Invalid Center ID."), // Included for clarity and passing data
  name: z.string().min(2, "Name must be at least 2 characters.").max(100).optional(),
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  departmentId: z.string().cuid("Invalid Department ID format.").optional().nullable(), // Department is optional
});

// Schema for managing a claim (Approve/Reject)
const ManageClaimSchema = z.object({
    claimId: z.string().cuid("Invalid Claim ID."),
    centerId: z.string().cuid("Invalid Center ID."), // Used for auth check
    coordinatorId: z.string().cuid("Invalid Coordinator ID."), // Used for auth check
});


// --- Create Department Action ---
/**
 * Creates a new department within the coordinator's assigned center.
 * @param values - Input data matching DepartmentSchema.
 * @returns ActionResult indicating success or failure.
 */
export async function createDepartment(values: unknown): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) {
        return { success: false, message: "Unauthorized: Only Coordinators can create departments." };
    }

    // 2. Validate input data
    const validatedFields = DepartmentSchema.safeParse(values);
    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, message: firstError || "Invalid data provided." };
    }
    const { name, centerId } = validatedFields.data;

    console.log(`Coordinator Action: Attempting to create Department "${name}" for Center ${centerId}`);
    try {
        // 3. Verify coordinator owns this center
        const center = await prisma.center.findFirst({
            where: { id: centerId, coordinatorId: session.userId }, // Check ownership
            select: { id: true }
        });
        if (!center) {
            return { success: false, message: "Unauthorized: You do not coordinate this center." };
        }

        // 4. Create department
        const newDepartment = await prisma.department.create({
            data: { name, centerId },
        });
        console.log(`Coordinator Action: Created Department ${newDepartment.id}`);

        // 5. Revalidate path for the departments page of this center
        revalidatePath(`/coordinator/${centerId}/departments`);

        // 6. Return success
        return { success: true, message: `Department "${name}" created successfully.`, departmentId: newDepartment.id };
    } catch (error) {
        console.error("Create Department Error:", error);
        // Handle unique constraint violation (department name unique within center)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return { success: false, message: `A department named "${name}" already exists in this center.` };
        }
        return { success: false, message: "An internal error occurred while creating the department." };
    }
}

// --- Update Department Action ---
/**
 * Updates the name of an existing department within the coordinator's center.
 * @param values - Object containing departmentId, new name, and centerId.
 * @returns ActionResult indicating success or failure.
 */
export async function updateDepartment(values: { departmentId: string, name: string, centerId: string }): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) {
        return { success: false, message: "Unauthorized." };
    }

    // 2. Basic validation (can enhance with Zod if needed)
    if (!values.departmentId || !values.name || !values.centerId || values.name.trim().length < 2) {
        return { success: false, message: "Invalid data provided. Name must be at least 2 characters." };
    }
    const { departmentId, name, centerId } = values;
    const trimmedName = name.trim(); // Use trimmed name

    console.log(`Coordinator Action: Attempting to update Department ${departmentId} to name "${trimmedName}"`);
    try {
        // 3. Verify coordinator owns the center this department belongs to
        const department = await prisma.department.findFirst({
            where: { id: departmentId, centerId: centerId }, // Check department exists in the specified center
            select: { center: { select: { coordinatorId: true } } } // Select coordinatorId for auth check
        });
        // Check if department exists and if the center's coordinator matches the session user
        if (!department || department.center?.coordinatorId !== session.userId) {
            return { success: false, message: "Unauthorized: You do not coordinate the center this department belongs to, or the department was not found." };
        }

        // 4. Update department name
        const updatedDepartment = await prisma.department.update({
            where: { id: departmentId },
            data: { name: trimmedName }, // Use the trimmed name
        });
        console.log(`Coordinator Action: Updated Department ${departmentId}`);

        // 5. Revalidate the departments page
        revalidatePath(`/coordinator/${centerId}/departments`);

        // 6. Return success
        return { success: true, message: `Department name updated successfully.`, departmentId: updatedDepartment.id };
    } catch (error) {
        console.error("Update Department Error:", error);
        // Handle unique constraint violation on update
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return { success: false, message: `A department named "${trimmedName}" already exists in this center.` };
        }
        // Handle record not found error during update
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return { success: false, message: "Department not found. It may have been deleted." };
        }
        return { success: false, message: "An internal error occurred while updating the department." };
    }
}

// --- Delete Department Action ---
/**
 * Deletes a department within the coordinator's center after unassigning lecturers.
 * @param values - Input data matching DeleteDepartmentSchema.
 * @returns ActionResult indicating success or failure.
 */
export async function deleteDepartment(values: unknown): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) {
        return { success: false, message: "Unauthorized." };
    }

    // 2. Validate input
    const validatedFields = DeleteDepartmentSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided." };
    }
    const { departmentId, centerId } = validatedFields.data;

    console.log(`Coordinator Action: Attempting to delete Department ${departmentId} from Center ${centerId}`);
    try {
        // 3. Verify coordinator owns the center this department belongs to
        const department = await prisma.department.findFirst({
            where: { id: departmentId, centerId: centerId }, // Check department exists in the specified center
            select: { name: true, center: { select: { coordinatorId: true } } } // Select name for message and coordinatorId for auth
        });
        // Check if department exists and if the center's coordinator matches the session user
        if (!department || department.center?.coordinatorId !== session.userId) {
            return { success: false, message: "Unauthorized: You do not coordinate the center this department belongs to, or the department was not found." };
        }

        // 4. **Important**: Unassign lecturers from this department BEFORE deleting it
        const updatedUsers = await prisma.user.updateMany({
            where: { departmentId: departmentId }, // Find users assigned to this department
            data: { departmentId: null }, // Set their departmentId to null
        });
        if (updatedUsers.count > 0) {
            console.log(`Coordinator Action: Unassigned ${updatedUsers.count} lecturers from Department ${departmentId}`);
        }

        // 5. Delete the department
        await prisma.department.delete({ where: { id: departmentId } });

        console.log(`Coordinator Action: Deleted Department ${departmentId}`);

        // 6. Revalidate paths
        revalidatePath(`/coordinator/${centerId}/departments`); // Revalidate departments list
        revalidatePath(`/coordinator/${centerId}/lecturers`); // Revalidate lecturer list as assignments changed

        // 7. Return success
        return { success: true, message: `Department "${department.name}" deleted successfully.` };
    } catch (error) {
        console.error("Delete Department Error:", error);
        // Handle record not found error during delete
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return { success: false, message: "Department not found. It may have already been deleted." };
        }
        return { success: false, message: "An internal error occurred while deleting the department." };
    }
}


// --- Assign Lecturer to Department Action ---
/**
 * Assigns a lecturer (who belongs to the coordinator's center) to a specific department within that center.
 * @param values - Input data matching AssignLecturerDepartmentSchema.
 * @returns ActionResult indicating success or failure.
 */
export async function assignLecturerToDepartment(values: unknown): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) {
        return { success: false, message: "Unauthorized." };
    }

    // 2. Validate input
    const validatedFields = AssignLecturerDepartmentSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided." };
    }
    const { departmentId, lecturerId, centerId } = validatedFields.data;

    console.log(`Coordinator Action: Attempting to assign Lecturer ${lecturerId} to Department ${departmentId} in Center ${centerId}`);
    try {
        // 3. Verify coordinator owns the center
        const center = await prisma.center.findFirst({ where: { id: centerId, coordinatorId: session.userId }, select: { id: true } });
        if (!center) {
            return { success: false, message: "Unauthorized: You do not coordinate this center." };
        }

        // 4. Verify department exists within this center
        const department = await prisma.department.findFirst({ where: { id: departmentId, centerId: centerId }, select: { id: true } });
        if (!department) {
            return { success: false, message: "Department not found in this center." };
        }

        // 5. Verify lecturer exists, has LECTURER role, and belongs to this center
        const lecturer = await prisma.user.findFirst({ where: { id: lecturerId, lecturerCenterId: centerId, role: Role.LECTURER }, select: { id: true, departmentId: true } });
        if (!lecturer) {
            return { success: false, message: "Lecturer not found or not assigned to this center." };
        }

        // 6. Update lecturer's department assignment
        await prisma.user.update({
            where: { id: lecturerId },
            data: { departmentId: departmentId }, // Set the departmentId foreign key
        });

        console.log(`Coordinator Action: Assigned Lecturer ${lecturerId} to Department ${departmentId}`);

        // 7. Revalidate paths
        revalidatePath(`/coordinator/${centerId}/departments`); // Revalidate departments list (lecturer count might change)
        revalidatePath(`/coordinator/${centerId}/lecturers`); // Revalidate lecturer list (assignment changed)

        // 8. Return success
        return { success: true, message: "Lecturer assigned to department successfully." };
    } catch (error) {
        console.error("Assign Lecturer to Dept Error:", error);
        return { success: false, message: "An internal error occurred while assigning the lecturer." };
    }
}

// --- Unassign Lecturer from Department Action ---
/**
 * Removes a lecturer's assignment from their current department within the coordinator's center.
 * @param values - Object containing lecturerId and centerId.
 * @returns ActionResult indicating success or failure.
 */
export async function unassignLecturerFromDepartment(values: { lecturerId: string, centerId: string }): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) {
        return { success: false, message: "Unauthorized." };
    }

    const { lecturerId, centerId } = values;
    // 2. Basic check for required IDs
    if(!lecturerId || !centerId) {
        return { success: false, message: "Invalid data: Lecturer ID and Center ID are required." };
    }

    console.log(`Coordinator Action: Attempting to unassign Lecturer ${lecturerId} from Department in Center ${centerId}`);
    try {
        // 3. Verify coordinator owns the center
        const center = await prisma.center.findFirst({ where: { id: centerId, coordinatorId: session.userId }, select: { id: true } });
        if (!center) {
            return { success: false, message: "Unauthorized: You do not coordinate this center." };
        }

        // 4. Verify lecturer exists, belongs to this center, and has the LECTURER role
        const lecturer = await prisma.user.findFirst({ where: { id: lecturerId, lecturerCenterId: centerId, role: Role.LECTURER }, select: { id: true, departmentId: true } });
        if (!lecturer) {
            return { success: false, message: "Lecturer not found or not assigned to this center." };
        }
        // Check if they are actually assigned to a department before trying to unassign
        if (!lecturer.departmentId) {
            // Already unassigned, consider this a success or neutral operation
            return { success: true, message: "Lecturer is not currently assigned to any department." };
        }

        // 5. Update lecturer's department assignment to null
        await prisma.user.update({
            where: { id: lecturerId },
            data: { departmentId: null }, // Clear the departmentId foreign key
        });

        console.log(`Coordinator Action: Unassigned Lecturer ${lecturerId} from Department`);

        // 6. Revalidate paths
        revalidatePath(`/coordinator/${centerId}/departments`); // Revalidate departments list (lecturer count might change)
        revalidatePath(`/coordinator/${centerId}/lecturers`); // Revalidate lecturer list (assignment changed)

        // 7. Return success
        return { success: true, message: "Lecturer unassigned from department successfully." };
    } catch (error) {
        console.error("Unassign Lecturer from Dept Error:", error);
        return { success: false, message: "An internal error occurred while unassigning the lecturer." };
    }
}


// --- Create Lecturer for Center Server Action ---
/**
 * Creates a new Lecturer user and assigns them directly to the Coordinator's center
 * and optionally to a specific department within that center.
 * Only accessible by users with the COORDINATOR role for their assigned center.
 * @param values - Input data including centerId, name, email, password, and optional departmentId.
 * @returns ActionResult indicating success or failure.
 */
export async function createLecturerForCenter(values: unknown): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) {
        return { success: false, message: "Unauthorized." };
    }

    // 2. Validate input data using the schema
    const validatedFields = CreateLecturerSchema.safeParse(values);
    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, message: firstError || "Invalid data." };
    }
    const { centerId, name, email, password, departmentId } = validatedFields.data;

    console.log(`Coordinator Action: Attempting to create Lecturer ${email} for Center ${centerId}` + (departmentId ? ` in Dept ${departmentId}` : ''));
    try {
        // 3. Verify coordinator owns this center
        const center = await prisma.center.findFirst({ where: { id: centerId, coordinatorId: session.userId }, select: { id: true } });
        if (!center) {
            return { success: false, message: "Unauthorized: You do not coordinate this center." };
        }

        // 4. If departmentId is provided, verify it belongs to this center
        if (departmentId) {
            const department = await prisma.department.findFirst({
                where: { id: departmentId, centerId: centerId }, // Check both ID and center linkage
                select: { id: true }
            });
            if (!department) {
                return { success: false, message: "Selected department does not belong to this center." };
            }
        }

        // 5. Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, message: `A user with the email ${email} already exists.` };
        }

        // 6. Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: Role.LECTURER,
                lecturerCenterId: centerId,
                // Conditionally set departmentId if provided and valid
                departmentId: departmentId || null, // Set to null if not provided or empty string passed validation
            },
        });
        console.log(`Coordinator Action: Created Lecturer ${newUser.id}`);

        // 7. Revalidate paths
        revalidatePath(`/coordinator/${centerId}/lecturers`);
        revalidatePath(`/coordinator/${centerId}/departments`); // Lecturer count might change
        revalidatePath('/registry/users'); // Update registry user list

        // 8. Return success
        return { success: true, message: `Lecturer ${newUser.email} created successfully.`, userId: newUser.id };
    } catch (error) {
        console.error("Create Lecturer Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return { success: false, message: `A user with the email ${email} already exists.` };
        }
        return { success: false, message: "An internal error occurred while creating the lecturer." };
    }
}


// --- Approve Claim Action ---
/**
 * Approves a pending claim within the coordinator's center.
 * @param values - Object containing claimId, centerId, coordinatorId (for auth).
 * @returns ActionResult indicating success or failure.
 */
export async function approveClaim(values: unknown): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) return { success: false, message: "Unauthorized." };

    // 2. Validate input
    const validatedFields = ManageClaimSchema.safeParse(values);
    if (!validatedFields.success) return { success: false, message: "Invalid data." };
    const { claimId, centerId, coordinatorId } = validatedFields.data;

    // 3. **Security**: Ensure the logged-in user IS the coordinator passed and owns the center
    if (session.userId !== coordinatorId) return { success: false, message: "Session mismatch." };

    console.log(`Coordinator Action: Attempting to approve Claim ${claimId} for Center ${centerId}`);
    try {
        // 4. Verify coordinator owns the center this claim belongs to and claim is PENDING
        const claim = await prisma.claim.findFirst({
            where: { id: claimId, centerId: centerId }, // Check claim exists in the center
            select: { status: true, center: { select: { coordinatorId: true } }, submittedById: true } // Get status, center coordinator, and submitter ID
        });
        // Check existence and ownership
        if (!claim || claim.center?.coordinatorId !== session.userId) {
            return { success: false, message: "Unauthorized or Claim not found." };
        }
        // Check if claim is already processed
        if (claim.status !== ClaimStatus.PENDING) {
             return { success: false, message: `Claim is already ${claim.status.toLowerCase()}. Cannot change status.` };
        }

        // 5. Update claim status
        const updatedClaim = await prisma.claim.update({
            where: { id: claimId },
            data: {
                status: ClaimStatus.APPROVED, // Set status to APPROVED
                processedById: session.userId, // Record who processed it
                processedAt: new Date(),      // Record when it was processed
            },
        });
        console.log(`Coordinator Action: Approved Claim ${claimId}`);

        // 6. Revalidate relevant paths
        revalidatePath(`/coordinator/${centerId}/claims`); // Revalidate claims list for coordinator
        revalidatePath(`/coordinator/${centerId}/claims/${claimId}`); // Revalidate this claim's detail page
        revalidatePath(`/lecturer/${claim.submittedById}/claims`); // Revalidate lecturer's claim list
        revalidatePath(`/lecturer/${centerId}/claims/${claimId}`); // Revalidate lecturer's detail view of this claim
        revalidatePath(`/dashboard`); // Revalidate dashboard counts if applicable

        // 7. Return success
        return { success: true, message: `Claim approved successfully.`, claimId: updatedClaim.id };
    } catch (error) {
        console.error("Approve Claim Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return { success: false, message: "Claim not found." };
        return { success: false, message: "Internal error approving claim." };
    }
}

// --- Reject Claim Action ---
/**
 * Rejects a pending claim within the coordinator's center.
 * @param values - Object containing claimId, centerId, coordinatorId (for auth).
 * @returns ActionResult indicating success or failure.
 */
export async function rejectClaim(values: unknown): Promise<ActionResult> {
    // 1. Verify user role
    const session = getCurrentUserSession();
    if (session?.role !== Role.COORDINATOR) return { success: false, message: "Unauthorized." };

    // 2. Validate input
    const validatedFields = ManageClaimSchema.safeParse(values);
    if (!validatedFields.success) return { success: false, message: "Invalid data." };
    const { claimId, centerId, coordinatorId } = validatedFields.data;

    // 3. **Security**: Ensure the logged-in user IS the coordinator passed and owns the center
    if (session.userId !== coordinatorId) return { success: false, message: "Session mismatch." };

    console.log(`Coordinator Action: Attempting to reject Claim ${claimId} for Center ${centerId}`);
    try {
        // 4. Verify coordinator owns the center this claim belongs to and claim is PENDING
        const claim = await prisma.claim.findFirst({
            where: { id: claimId, centerId: centerId }, // Check claim exists in the center
            select: { status: true, center: { select: { coordinatorId: true } }, submittedById: true } // Get status, center coordinator, submitter ID
        });
        // Check existence and ownership
        if (!claim || claim.center?.coordinatorId !== session.userId) {
            return { success: false, message: "Unauthorized or Claim not found." };
        }
         // Check if claim is already processed
        if (claim.status !== ClaimStatus.PENDING) {
             return { success: false, message: `Claim is already ${claim.status.toLowerCase()}. Cannot change status.` };
        }

        // 5. Update claim status
        const updatedClaim = await prisma.claim.update({
            where: { id: claimId },
            data: {
                status: ClaimStatus.REJECTED, // Set status to REJECTED
                processedById: session.userId, // Record who processed it
                processedAt: new Date(),      // Record when it was processed
             },
        });
        console.log(`Coordinator Action: Rejected Claim ${claimId}`);

        // 6. Revalidate relevant paths
        revalidatePath(`/coordinator/${centerId}/claims`); // Revalidate claims list for coordinator
        revalidatePath(`/coordinator/${centerId}/claims/${claimId}`); // Revalidate this claim's detail page
        revalidatePath(`/lecturer/${claim.submittedById}/claims`); // Revalidate lecturer's claim list
        revalidatePath(`/lecturer/${centerId}/claims/${claimId}`); // Revalidate lecturer's detail view of this claim
        revalidatePath(`/dashboard`); // Revalidate dashboard counts if applicable

        // 7. Return success
        return { success: true, message: `Claim rejected successfully.`, claimId: updatedClaim.id };
    } catch (error) {
        console.error("Reject Claim Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return { success: false, message: "Claim not found." };
        return { success: false, message: "Internal error rejecting claim." };
    }
}
