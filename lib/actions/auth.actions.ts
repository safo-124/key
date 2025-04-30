"use server"; // Directive to mark this file for Server Actions

import { z } from "zod";
import bcrypt from "bcryptjs"; // For password hashing and comparison
import { Prisma } from "@prisma/client"; // Import Prisma types if needed for error handling
import { cookies } from 'next/headers'; // Import cookies function for session management

import prisma from "@/lib/prisma"; // Import your Prisma Client instance
import { Role } from "@prisma/client"; // Import the Role enum from generated client

// --- Constants ---
const SESSION_COOKIE_NAME = 'app_session'; // Name for our session cookie

// --- Validation Schemas ---
const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password cannot be empty."),
});

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(), // Make name optional to match form
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// --- Types for Return Values ---
// Define consistent return types for actions
type ActionResult = {
  success: boolean; // True if action succeeded, false otherwise
  message?: string; // User-friendly message (success or error)
  // Optionally return user data on successful login
  user?: { id: string; name: string | null; email: string; role: Role };
};

// --- Login Server Action ---
/**
 * Attempts to log in a user by verifying their email and password.
 * Creates a session cookie on successful login.
 * @param values - Object containing email and password, matching LoginSchema.
 * @returns ActionResult indicating success or failure, potentially with user data.
 */
export async function loginUser(values: unknown): Promise<ActionResult> {
  // 1. Validate input on the server
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    console.warn("Login validation failed:", validatedFields.error.flatten());
    return { success: false, message: "Invalid email or password provided." }; // Keep message generic
  }
  const { email, password } = validatedFields.data;

  console.log(`Auth Action: Attempting login for email: ${email}`);

  try {
    // 2. Find user by email in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Check if user exists and has a password set
    if (!user || !user.password) {
      console.log(`Auth Action: Login failed - No user found or no password for email ${email}`);
      return { success: false, message: "Invalid email or password." }; // Generic error
    }

    // 4. Compare provided password with the stored hashed password
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      console.log(`Auth Action: Login failed - Password mismatch for email ${email}`);
      return { success: false, message: "Invalid email or password." }; // Generic error
    }

    // 5. Login successful - Proceed with session management
    console.log(`Auth Action: Login successful for user: ${user.id}, role: ${user.role}`);

    // --- Session Management: Set Cookie ---
    // WARNING: Storing raw user data directly in a cookie is generally insecure for production.
    // Consider using encrypted sessions (e.g., iron-session, next-auth) or JWTs for better security.
    const sessionData = JSON.stringify({
        userId: user.id,
        role: user.role,
        name: user.name // Include name for display purposes
    });
    cookies().set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true, // Prevent client-side JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // Example: Cookie valid for 7 days
      path: '/', // Cookie available across the entire site
      sameSite: 'lax', // Provides some CSRF protection
    });
    console.log(`Auth Action: Session cookie set for user ${user.id}`);
    // --- End of Session Management ---

    // 6. Return success response (including basic user info, excluding password)
    return {
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

  } catch (error) {
    console.error("Login Action Error:", error);
    // Handle potential database errors specifically if needed
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    return { success: false, message: "An internal server error occurred during login. Please try again." };
  }
}


// --- Signup Server Action ---
/**
 * Attempts to register a new user with the default REGISTRY role.
 * WARNING: This is a security risk for public-facing applications.
 * @param values - Object containing name (optional), email, and password, matching SignupSchema.
 * @returns ActionResult indicating success or failure.
 */
export async function signupUser(values: unknown): Promise<ActionResult> {
    // 1. Validate input on the server
    const validatedFields = SignupSchema.safeParse(values);
    if (!validatedFields.success) {
        console.warn("Signup validation failed:", validatedFields.error.flatten());
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, message: firstError || "Invalid data provided." };
    }
    const { name, email, password } = validatedFields.data;

    console.log(`Auth Action: Attempting signup for email: ${email}`);

    try {
        // 2. Check if a user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`Auth Action: Signup failed - Email ${email} already exists.`);
            return { success: false, message: "An account with this email already exists." };
        }

        // 3. Hash the provided password securely
        const hashedPassword = await bcrypt.hash(password, 10); // Use appropriate salt rounds (e.g., 10-12)

        // 4. Create the new user in the database with REGISTRY role
        const newUser = await prisma.user.create({
            data: {
                name: name || null, // Use provided name or null if optional and empty
                email,
                password: hashedPassword,
                role: Role.REGISTRY, // *** Assign REGISTRY role by default ***
            },
        });

        console.log(`Auth Action: Signup successful for new user: ${newUser.id} with role ${newUser.role}`);

        // 5. Return success response
        return {
            success: true,
            message: "Registry account created successfully! You can now log in.",
            // Optionally return basic user info (excluding password) if needed immediately after signup
            // user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        };

    } catch (error) {
        console.error("Signup Action Error:", error);
         // Handle potential database errors (e.g., unique constraint violation if email check somehow failed)
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
             // Should be caught by the check above, but handle just in case
             return { success: false, message: "An account with this email already exists." };
         }
        return { success: false, message: "An internal server error occurred during signup. Please try again." };
    }
}


// --- Logout Action ---
/**
 * Logs the user out by deleting the session cookie.
 * @returns ActionResult indicating success or failure.
 */
export async function logoutUser(): Promise<ActionResult> {
  try {
    console.log("Auth Action: Logging out user...");
    // Delete the session cookie
    cookies().delete(SESSION_COOKIE_NAME);
    return { success: true, message: "Logged out successfully." };
  } catch (error) {
    console.error("Logout Action Error:", error);
    return { success: false, message: "An internal error occurred during logout." };
  }
}
