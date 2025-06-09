// test-user-creation.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function testUserCreation() {
  try {
    console.log("Testing user creation with integer ID...");

    // Generate a test email with timestamp to avoid conflicts
    const testEmail = `test${Date.now()}@example.com`;

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10); // Create user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail,
        password: hashedPassword,
        id: "test-id-1", // Using a string ID since that's what the DB expects
      },
    });

    console.log("User created successfully:", {
      id: user.id,
      name: user.name,
      email: user.email,
      idType: typeof user.id,
    });

    // Clean up - delete the test user
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("Test user deleted successfully");

    return { success: true };
  } catch (error) {
    console.error("Error in test user creation:", error);
    return { error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

testUserCreation()
  .then((result) => console.log("Test completed:", result))
  .catch((error) => console.error("Test failed:", error));
