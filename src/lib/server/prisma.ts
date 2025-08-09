import { PrismaClient } from "@prisma/client";
import { env } from "$env/dynamic/private";

// This declaration is used to tell TypeScript that we are adding a custom
// property to the global object.
declare global {
  var __prisma: PrismaClient | undefined;
}

// This is the singleton instance of the Prisma Client.
const prisma: PrismaClient =
  global.__prisma ||
  new PrismaClient({
    // Optional: Log database queries in development
    log:
      env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : [],
  });

// In development, we store the instance on the global object. This prevents
// HMR from creating a new Prisma Client instance on every file change.
if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

// Export the single instance to be used across your server-side code.
export default prisma;
