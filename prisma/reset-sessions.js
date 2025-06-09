import { PrismaClient } from "@prisma/client";

// This script clears Next.js session data to ensure clean authentication after changing ID types
async function main() {
  const prisma = new PrismaClient();

  try {
    // PostgreSQL syntax (for reference, not needed in MySQL)
    // await prisma.$executeRawUnsafe(`TRUNCATE TABLE "next_auth_sessions" CASCADE;`);

    // MySQL syntax
    console.log("Attempting to clear session tables...");

    // Try to clear the sessions table if it exists
    try {
      await prisma.$executeRawUnsafe("DELETE FROM sessions;");
      console.log("Successfully cleared sessions table");
    } catch (e) {
      console.log("No sessions table found or error clearing sessions:", e);
    }

    // Try to clear accounts table if it exists
    try {
      await prisma.$executeRawUnsafe("DELETE FROM accounts;");
      console.log("Successfully cleared accounts table");
    } catch (e) {
      console.log("No accounts table found or error clearing accounts:", e);
    }

    // Try to clear verification tokens table if it exists
    try {
      await prisma.$executeRawUnsafe("DELETE FROM verification_tokens;");
      console.log("Successfully cleared verification_tokens table");
    } catch (e) {
      console.log("No verification_tokens table found or error:", e);
    }

    console.log("Session data reset completed");
  } catch (error) {
    console.error("Error resetting sessions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log("Session reset complete"))
  .catch((e) => console.error("Error in reset script:", e));
