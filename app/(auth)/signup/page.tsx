import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { SignupForm } from '@/components/auth/SignupForm'; // Assuming SignupForm component path is correct
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
  title: 'Sign Up - UEW Claims Portal', // Updated title
  description: 'Create an account for the University of Education, Winneba Claims Management Portal',
};

// --- Path to your logo inside the 'public' folder ---
// Using the filename "image.png" as specified by the user
const uewLogoPath = "/image.png";

// The Signup Page component - Redesigned
export default function SignupPage() {
  return (
    // Full screen container with gradient background and centered content
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
        <div className="flex w-full max-w-md flex-col items-center"> {/* Max width container for content */}

            {/* UEW Logo */}
            <div className="mb-8 transform transition-transform duration-300 hover:scale-110">
                <Image
                    src={uewLogoPath} // Use the local path
                    alt="University of Education, Winneba Logo"
                    width={120} // Slightly larger logo
                    height={120}
                    className="rounded-full shadow-md" // Added subtle shadow
                    priority // Prioritize loading the logo
                />
            </div>

            {/* Signup Card with enhanced styling */}
            <Card className="w-full rounded-xl border-t-4 border-red-700 shadow-lg overflow-hidden"> {/* More rounded corners, larger shadow */}
                <CardHeader className="space-y-1 bg-gray-50/50 px-6 py-5 text-center"> {/* Subtle background for header */}
                    <CardTitle className="text-2xl font-bold text-gray-800">Create UEW Claims Account</CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your details below to register
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6"> {/* Increased padding */}
                    {/* Render the actual signup form */}
                    <SignupForm />
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-3 bg-gray-50/50 px-6 py-4 text-sm"> {/* Subtle background for footer */}
                    {/* Link to Login Page */}
                    <div className="text-center text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-red-700 underline hover:text-red-800 transition-colors duration-200">
                            Sign in here
                        </Link>
                    </div>
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
