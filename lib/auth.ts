// lib/auth.ts
import { cookies } from 'next/headers';
import { Role } from '@prisma/client'; // Import Role enum

// Name of the session cookie (must match the one used in auth.actions.ts and middleware.ts)
const SESSION_COOKIE_NAME = 'app_session';

// Type definition for the session data stored in the cookie
export type UserSession = {
  userId: string;
  role: Role;
  name: string | null;
} | null; // Can be null if user is not logged in or cookie is invalid

/**
 * Gets the current user session data from the request cookies.
 * This function should only be called in Server Components or Server Actions.
 * @returns {UserSession} The parsed user session data or null if not found/invalid.
 */
export function getCurrentUserSession(): UserSession {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    console.log("getCurrentUserSession: No session cookie found.");
    return null; // No cookie found
  }

  try {
    // Parse the cookie value
    const sessionData = JSON.parse(sessionCookie.value);

    // Basic validation of the parsed data
    if (!sessionData.userId || !sessionData.role) {
       console.warn("getCurrentUserSession: Invalid session data structure.", sessionData);
       // Optionally clear the invalid cookie here if needed
       // cookieStore.delete(SESSION_COOKIE_NAME);
       return null;
    }

    // Ensure the role is a valid enum value (basic check)
    if (!Object.values(Role).includes(sessionData.role)) {
        console.warn("getCurrentUserSession: Invalid role value in session data.", sessionData.role);
        // Optionally clear the invalid cookie
        // cookieStore.delete(SESSION_COOKIE_NAME);
        return null;
    }

    console.log("getCurrentUserSession: Session found for user:", sessionData.userId, "Role:", sessionData.role);
    // Return the validated session data
    return {
      userId: sessionData.userId,
      role: sessionData.role as Role, // Cast to Role type after validation
      name: sessionData.name || null,
    };
  } catch (error) {
    console.error("getCurrentUserSession: Error parsing session cookie.", error);
    // Optionally clear the malformed cookie
    // cookieStore.delete(SESSION_COOKIE_NAME);
    return null; // Error parsing JSON or other issues
  }
}

