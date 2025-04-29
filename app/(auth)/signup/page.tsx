import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm'; // We will create this component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import shadcn Card components

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

// The Signup Page component
export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm"> {/* Use shadcn Card for styling */}
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Render the actual signup form component */}
        <SignupForm />
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
         {/* Link back to the login page */}
         <div className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Login
            </Link>
          </div>
      </CardFooter>
    </Card>
  );
}
