const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@dawai.com' },
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@dawai.com',
        username: 'admin',
        passwordHash: hashedPassword,
        name: 'Admin User',
        phone: '+8801712345678',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('✓ Admin user created successfully');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: admin123`);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
