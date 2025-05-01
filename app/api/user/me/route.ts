import { NextResponse } from 'next/server'; // Next.js Response object
import { cookies } from 'next/headers'; // Function to access cookies server-side
import prisma from '@/lib/prisma'; // Your Prisma client instance
import { Role } from '@prisma/client'; // Import Role enum if needed

// Define the structure of the data returned by the API
interface UserMeResponse {
    id: string;
    name: string | null;
    email: string; // Include email for potential use
    role: Role; // Include role for potential use
}

// Name of the session cookie (must match the one used elsewhere)
const SESSION_COOKIE_NAME = 'app_session';

// GET handler for the /api/user/me route
export async function GET(request: Request) {
  console.log("API Route /api/user/me: Received GET request.");

  try {
    // 1. Get the session cookie from the request headers
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get(SESSION_COOKIE_NAME);

    // 2. Check if the cookie exists
    if (!sessionCookie?.value) {
      console.log("API Route /api/user/me: No session cookie found.");
      // Return 401 Unauthorized if no session cookie is found
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 3. Parse the session data from the cookie
    let sessionData: { userId: string; role: Role; name?: string | null };
    try {
      // Ensure proper decoding if the cookie value was encoded
      sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
      // Basic validation of parsed data
      if (!sessionData?.userId) {
          throw new Error("Invalid session data structure: userId missing.");
      }
      console.log(`API Route /api/user/me: Parsed session data for userId: ${sessionData.userId}`);
    } catch (error) {
      console.error("API Route /api/user/me: Error parsing session cookie:", error);
      // Clear potentially invalid cookie and return Unauthorized
      const response = NextResponse.json({ message: 'Invalid session' }, { status: 401 });
      response.cookies.delete(SESSION_COOKIE_NAME); // Attempt to clear bad cookie
      return response;
    }

    // 4. Fetch user details from the database using the userId from the session
    const user = await prisma.user.findUnique({
      where: {
        id: sessionData.userId,
      },
      select: { // Select only the necessary fields to return
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // 5. Handle case where user is not found in the database (should be rare if session is valid)
    if (!user) {
      console.warn(`API Route /api/user/me: User not found in DB for session userId: ${sessionData.userId}. Invalidating session.`);
      // Clear the cookie and return 401 as the session points to a non-existent user
      const response = NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // 6. Return the user data successfully
    console.log(`API Route /api/user/me: Successfully fetched user data for ${user.email}`);
    const responseData: UserMeResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    // 7. Handle unexpected server errors
    console.error("API Route /api/user/me: Internal Server Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Optional: Add handlers for other methods (POST, PUT, DELETE) if needed for this route,
// otherwise they will default to 405 Method Not Allowed.
// export async function POST(request: Request) { ... }
