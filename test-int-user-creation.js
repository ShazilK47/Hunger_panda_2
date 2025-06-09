// test-int-user-creation.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function testUserCreation() {
  try {
    console.log(
      "Starting user creation test with auto-incrementing integer IDs"
    );

    // Create a test user with auto-incrementing integer ID
    const hashedPassword = await bcrypt.hash("testpassword123", 10);

    // First check if the user already exists and delete it
    const existingUser = await prisma.user.findUnique({
      where: { email: "testuser@example.com" },
    });

    if (existingUser) {
      console.log("Deleting existing test user:", existingUser.id);
      await prisma.user.delete({
        where: { id: existingUser.id },
      });
    }

    console.log("Creating new user...");
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        password: hashedPassword,
      },
    });

    console.log("Successfully created user with ID:", user.id);
    console.log("User data:", JSON.stringify(user, null, 2));
    console.log("ID type:", typeof user.id);

    // Cleanup - delete the test user
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("Test user deleted successfully");
  } catch (error) {
    console.error("Error in test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserCreation();
