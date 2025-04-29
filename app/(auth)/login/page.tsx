import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm'; // We will create this component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import shadcn Card components

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

// The Login Page component
export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm"> {/* Use shadcn Card for styling */}
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Render the actual login form component */}
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm">
         {/* Link to the signup page */}
         <div className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline hover:text-primary">
              Sign up
            </Link>
          </div>
          {/* Optional: Add forgot password link later */}
          {/*
          <div className="text-muted-foreground">
            <Link href="/forgot-password" className="underline hover:text-primary">
              Forgot password?
            </Link>
          </div>
          */}
      </CardFooter>
    </Card>
  );
}
