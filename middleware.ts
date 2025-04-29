import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Name of the session cookie (must match the one used in auth.actions.ts)
const SESSION_COOKIE_NAME = 'app_session';

// Paths that are considered public (accessible without login)
const publicPaths = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Get the session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  // 2. Check if the user is trying to access a protected route
  const isAccessingProtectedRoute = !publicPaths.some(path => pathname.startsWith(path)) && pathname !== '/'; // Exclude root path if it's public

  if (isAccessingProtectedRoute) {
    // If accessing protected route and no session cookie exists, redirect to login
    if (!sessionCookie) {
      console.log(`Middleware: No session cookie found for protected route ${pathname}. Redirecting to login.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optional: Add validation here to check if the cookie content is valid
    // For now, we just check for its existence.
    try {
        const sessionData = JSON.parse(sessionCookie.value);
        if (!sessionData.userId || !sessionData.role) {
            console.log(`Middleware: Invalid session data in cookie for ${pathname}. Redirecting to login.`);
            // Clear potentially invalid cookie
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete(SESSION_COOKIE_NAME);
            return response;
        }
        // If session exists and seems valid, allow the request to proceed
        console.log(`Middleware: Valid session found for ${pathname}. Allowing access.`);
        return NextResponse.next();

    } catch (error) {
         console.log(`Middleware: Error parsing session cookie for ${pathname}. Redirecting to login.`, error);
         const response = NextResponse.redirect(new URL('/login', request.url));
         response.cookies.delete(SESSION_COOKIE_NAME);
         return response;
    }

  }

  // 3. Check if the user is logged in and trying to access a public route (like /login)
  const isAccessingPublicRoute = publicPaths.some(path => pathname.startsWith(path));

  if (isAccessingPublicRoute && sessionCookie) {
    // If logged in, redirect from login/signup pages to the dashboard
    console.log(`Middleware: User already logged in, redirecting from ${pathname} to dashboard.`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. If none of the above conditions match, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Matcher specifies which routes the middleware should run on.
  // Avoid running middleware on static files (_next/static), images, etc.
  // And avoid running on API routes if not needed.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
