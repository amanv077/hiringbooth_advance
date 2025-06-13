import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123456', 12);
    
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@hiringbooth.com',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        isApproved: true,
        otpCode: null,
        otpExpiry: null
      }
    });

    console.log('✅ Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password: admin123456');
    console.log('⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
