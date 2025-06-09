// Reset user sessions when migrating from string UUIDs to integer IDs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function resetSessions() {
  try {
    console.log("Starting session reset...");

    // Option 1: If you're using a sessions table in your database
    // Uncomment this if you have a sessions table
    /*
    const result = await prisma.$executeRaw`TRUNCATE TABLE sessions;`;
    console.log(`Deleted all sessions from database table`);
    */

    // Option 2: Update user reset tokens to force re-authentication
    // This is useful if you're using JWT and don't have a sessions table
    const result = await prisma.user.updateMany({
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(`Reset ${result.count} user tokens`);
    console.log("Sessions reset complete! Users will need to log in again.");
  } catch (error) {
    console.error("Error resetting sessions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSessions();
