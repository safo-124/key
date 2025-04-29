// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance.
// This helps prevent creating multiple instances during development hot-reloads.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient.
// In production, always create a new instance.
// In development, reuse the existing instance attached to the global object if it exists,
// otherwise create a new one.
const prisma = global.prisma || new PrismaClient({
  // Optional: Enable logging for debugging database queries
  // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
});

// In development, attach the created Prisma Client instance to the global object.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export the Prisma Client instance for use in other parts of the application.
export default prisma;

