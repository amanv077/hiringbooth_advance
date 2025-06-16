const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create test USER
    const hashedPassword1 = await bcrypt.hash('password123', 12);
    const user1 = await prisma.user.create({
      data: {
        email: 'user@test.com',
        name: 'Test User',
        password: hashedPassword1,
        role: 'USER',
        isVerified: true,
      },
    });

    // Create test EMPLOYER
    const hashedPassword2 = await bcrypt.hash('password123', 12);
    const user2 = await prisma.user.create({
      data: {
        email: 'employer@test.com',
        name: 'Test Employer',
        password: hashedPassword2,
        role: 'EMPLOYER',
        isVerified: true,
        isApproved: true,
      },
    });

    // Create test ADMIN
    const hashedPassword3 = await bcrypt.hash('password123', 12);
    const user3 = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Test Admin',
        password: hashedPassword3,
        role: 'ADMIN',
        isVerified: true,
        isApproved: true,
      },
    });

    console.log('Test users created successfully:');
    console.log('USER: user@test.com / password123');
    console.log('EMPLOYER: employer@test.com / password123');
    console.log('ADMIN: admin@test.com / password123');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
