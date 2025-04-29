"use server"; // Directive to mark this file for Server Actions

import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { cookies } from 'next/headers';

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client"; // Import the Role enum from generated client

// --- Constants ---
const SESSION_COOKIE_NAME = 'app_session'; // Name for our session cookie

// --- Validation Schemas ---
const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password cannot be empty."),
});

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// --- Types for Return Values ---
type ActionResult = {
  success: boolean;
  message?: string;
  user?: { id: string; name: string | null; email: string; role: Role };
};

// --- Login Server Action (code remains the same) ---
export async function loginUser(values: unknown): Promise<ActionResult> {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid input provided." };
  }
  const { email, password } = validatedFields.data;

  console.log(`Attempting login for email: ${email}`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      console.log(`Login failed: No user found for email ${email}`);
      return { success: false, message: "Invalid email or password." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      console.log(`Login failed: Password mismatch for email ${email}`);
      return { success: false, message: "Invalid email or password." };
    }

    console.log(`Login successful for user: ${user.id}, role: ${user.role}`);

    // --- Session Management: Set Cookie ---
    // WARNING: Storing raw data like this is insecure for production.
    const sessionData = JSON.stringify({ userId: user.id, role: user.role, name: user.name });
    cookies().set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days validity
      path: '/',
      sameSite: 'lax',
    });
    // --- End of Session Management ---

    return {
      success: true,
      message: "Login successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };

  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, message: "An internal error occurred. Please try again." };
  }
}


// --- Signup Server Action (REVERTED DEFAULT ROLE TO LECTURER) ---
export async function signupUser(values: unknown): Promise<ActionResult> {
    const validatedFields = SignupSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, message: "Invalid input provided." };
    }
    const { name, email, password } = validatedFields.data;

    console.log(`Attempting signup for email: ${email}`);

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log(`Signup failed: Email ${email} already exists.`);
            return { success: false, message: "An account with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // --- Set default role back to LECTURER ---
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.LECTURER, // <<<--- Assign LECTURER role by default
                // Center and Department will be assigned later by Registry/Coordinator
            },
        });
        // --- End of Change ---

        console.log(`Signup successful for new user: ${newUser.id} with role ${newUser.role}`);

        // Let user know they need assignment after signup
        return {
            success: true,
            message: "Account created successfully! Please log in. You will need to be assigned to a center by an administrator.",
        };

    } catch (error) {
        console.error("Signup Action Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return { success: false, message: "An account with this email already exists." };
        }
        return { success: false, message: "An internal error occurred during signup. Please try again." };
    }
}


// --- Logout Action (code remains the same) ---
export async function logoutUser(): Promise<ActionResult> {
  try {
    console.log("Logging out user...");
    cookies().delete(SESSION_COOKIE_NAME);
    return { success: true, message: "Logged out successfully." };
  } catch (error) {
    console.error("Logout Action Error:", error);
    return { success: false, message: "An internal error occurred during logout." };
  }
}
