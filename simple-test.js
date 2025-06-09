// simple-test.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function simpleTest() {
  try {
    console.log('Starting simple user test');
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'Simple Test User',
        email: 'simple@test.com',
        password: 'hashedpassword',
      }
    });
    
    console.log('User created:', user);
    console.log('User ID type:', typeof user.id);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleTest();
