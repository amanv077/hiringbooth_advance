const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('amanaman', 12);

    // Create ADMIN user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@gmail.com' },
      update: {},
      create: {
        email: 'admin@gmail.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        isApproved: true,
      },
    });

    // Create EMPLOYER user
    const employer = await prisma.user.upsert({
      where: { email: 'employee@gmail.com' },
      update: {},
      create: {
        email: 'employee@gmail.com',
        name: 'Employer User',
        password: hashedPassword,
        role: 'EMPLOYER',
        isVerified: true,
        isApproved: true,
      },
    });

    // Create USER
    const user = await prisma.user.upsert({
      where: { email: 'user@gmail.com' },
      update: {},
      create: {
        email: 'user@gmail.com',
        name: 'Regular User',
        password: hashedPassword,
        role: 'USER',
        isVerified: true,
        isApproved: true,
      },
    });

    console.log('✅ Database seeded successfully!');
    console.log('Test users created:');
    console.log('👑 ADMIN: admin@gmail.com / amanaman');
    console.log('🏢 EMPLOYER: employee@gmail.com / amanaman');
    console.log('👤 USER: user@gmail.com / amanaman');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
