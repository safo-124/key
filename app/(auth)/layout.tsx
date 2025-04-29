import React from 'react';

// Layout for authentication pages (Login, Signup)
// It centers the content vertically and horizontally.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      {/* The children passed to this layout (e.g., Login Page or Signup Page) will be rendered here */}
      {children}
    </div>
  );
}
