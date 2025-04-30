import { cookies } from 'next/headers'; // Import cookies function from next/headers
import { redirect } from 'next/navigation'; // Import redirect function from next/navigation

// Name of the session cookie (must match the one used in auth.actions.ts and middleware.ts)
// Consider defining this in a shared constants file (e.g., lib/constants.ts) for consistency
const SESSION_COOKIE_NAME = 'app_session';

// This is the root page component for your application (e.g., accessed via '/')
// It runs on the server.
export default function RootPage() {
  // Get access to the request cookies on the server
  const cookieStore = cookies();
  // Check if the session cookie exists
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  // Determine the redirect target based on cookie presence
  if (sessionCookie) {
    // If the session cookie exists, assume the user is logged in
    // Redirect them to the main application dashboard
    console.log("RootPage: Session cookie found, redirecting to /dashboard.");
    redirect('/dashboard'); // Server-side redirect
  } else {
    // If no session cookie, assume the user is not logged in
    // Redirect them to the login page
    console.log("RootPage: No session cookie found, redirecting to /login.");
    redirect('/login'); // Server-side redirect
  }

  // Note: Since this component always redirects, it won't actually render anything.
  // You could technically return null or a loading indicator, but the redirect
  // happens before rendering completes in typical scenarios.
  // return null;
}
