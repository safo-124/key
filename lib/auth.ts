// lib/auth.ts
import { cookies } from 'next/headers'; // Import cookies function for server-side access
import { Role } from '@prisma/client'; // Import Role enum from Prisma client

// Name of the session cookie (ensure this matches the name used when setting the cookie in auth.actions.ts and checking in middleware.ts)
const SESSION_COOKIE_NAME = 'app_session';

// Type definition for the user session data expected to be stored in the cookie.
// It can be null if the user is not logged in or the cookie is invalid/missing.
export type UserSession = {
  userId: string; // Unique identifier for the user
  role: Role;     // User's role (e.g., REGISTRY, COORDINATOR, LECTURER)
  name: string | null; // User's display name (optional)
  // Add other relevant session data if needed (e.g., email, centerId for non-registry roles)
} | null;

/**
 * Gets the current user session data from the request cookies.
 *
 * !!! IMPORTANT: This function uses `next/headers` and MUST ONLY be called
 * within Server Components, Server Actions, Route Handlers, or middleware.
 * It will NOT work and will throw an error if called directly in Client Components. !!!
 *
 * @returns {UserSession | null} The parsed and validated user session data, or null if the session is not found or invalid.
 */
export function getCurrentUserSession(): UserSession {
  // cookies() is synchronous and only available on the server
  const cookieStore = cookies();
  // Attempt to retrieve the session cookie by its name
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME); // .get() is the correct method here

  // If the cookie doesn't exist or has no value, return null (no session)
  if (!sessionCookie?.value) {
    // console.log("getCurrentUserSession: No session cookie found."); // Optional: Log for debugging
    return null;
  }

  try {
    // Parse the JSON string stored in the cookie's value
    const sessionData = JSON.parse(sessionCookie.value);

    // --- Basic Validation ---
    // Check if essential fields (userId, role) exist in the parsed data
    if (!sessionData.userId || !sessionData.role) {
        console.warn("getCurrentUserSession: Invalid session data structure (missing userId or role).", sessionData);
        // Consider deleting the invalid cookie here for security
        // cookieStore.delete(SESSION_COOKIE_NAME);
        return null;
    }

    // Check if the role value is actually one of the valid Roles defined in the Prisma enum
    if (!Object.values(Role).includes(sessionData.role)) {
        console.warn("getCurrentUserSession: Invalid role value in session data.", sessionData.role);
        // Consider deleting the invalid cookie
        // cookieStore.delete(SESSION_COOKIE_NAME);
        return null;
    }

    // If validation passes, log success (optional) and return the structured session data
    // console.log("getCurrentUserSession: Session found for user:", sessionData.userId, "Role:", sessionData.role); // Optional: Log for debugging
    return {
      userId: sessionData.userId,
      role: sessionData.role as Role, // Cast to Role type after validation
      name: sessionData.name || null, // Use parsed name or null
      // Include other fields from sessionData if they exist and are needed
    };
  } catch (error) {
    // Catch errors during JSON parsing (e.g., malformed cookie value)
    console.error("getCurrentUserSession: Error parsing session cookie.", error);
    // Consider deleting the malformed cookie
    // cookieStore.delete(SESSION_COOKIE_NAME);
    return null; // Return null indicating an invalid session
  }
}

// You can add other auth-related utility functions here if needed,
// ensuring they are compatible with their intended execution environment (server/client).
