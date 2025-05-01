import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component for optimization
import { LoginForm } from '@/components/auth/LoginForm'; // Assuming LoginForm component path is correct
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Shadcn UI Card components

// Page metadata for SEO and browser tab
export const metadata: Metadata = {
  title: 'Login - UEW Claims Portal', // Updated title
  description: 'Login to the University of Education, Winneba Claims Management Portal',
};

// --- Path to your logo inside the 'public' folder ---
// Updated to use the filename provided by the user
const uewLogoPath = "/codellogo.png"; // Using the filename "image.png" from the public folder

// The Login Page component - Redesigned
export default function LoginPage() {
  return (
    // Full screen container with gradient background and centered content
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
        <div className="flex w-full max-w-md flex-col items-center"> {/* Max width container for content */}

            {/* UEW Logo */}
            <div className="mb-8 transform transition-transform duration-300 hover:scale-110">
                <Image
                    src={uewLogoPath} // Use the updated path
                    alt="University of Education, Winneba Logo"
                    width={120} // Slightly larger logo
                    height={120}
                    className="rounded-full shadow-md" // Added subtle shadow
                    priority // Prioritize loading the logo
                    // Consider adding unoptimized={true} if using SVG or having issues
                />
            </div>

            {/* Login Card with enhanced styling */}
            <Card className="w-full rounded-xl border-t-4 border-red-700 shadow-lg overflow-hidden"> {/* More rounded corners, larger shadow */}
                <CardHeader className="space-y-1 bg-gray-50/50 px-6 py-5 text-center"> {/* Subtle background for header */}
                    <CardTitle className="text-2xl font-bold text-gray-800">UEW Claims Portal</CardTitle>
                    <CardDescription className="text-gray-600">
                        Please sign in to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6"> {/* Increased padding */}
                    {/* Render the actual login form */}
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-3 bg-gray-50/50 px-6 py-4 text-sm"> {/* Subtle background for footer */}
                    {/* Link to Signup Page */}
                    <div className="text-center text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-medium text-red-700 underline hover:text-red-800 transition-colors duration-200">
                            Sign up here
                        </Link>
                    </div>
                    {/* Optional: Forgot Password Link */}
                    {/* <div className="text-center text-gray-500">
                        <Link href="/forgot-password" className="text-xs underline hover:text-red-700 transition-colors duration-200">
                            Forgot password?
                        </Link>
                    </div> */}
                </CardFooter>
            </Card>

            {/* Footer text below the card */}
            <p className="mt-6 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} University of Education, Winneba. All rights reserved.
            </p>
       </div>
    </div>
  );
}
