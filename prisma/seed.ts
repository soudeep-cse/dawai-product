import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@dawai.com' },
    update: {},
    create: {
      email: 'admin@dawai.com',
      username: 'admin',
      phone: '01712345678',
      name: 'Super Admin',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin created:', admin.email);

  // Create categories
  const categories = [
    {
      slug: 'prescription',
      nameBn: 'প্রেসক্রিপশন মেডিসিন',
      nameEn: 'Prescription Medicine',
      descriptionBn: 'ডাক্তারের পরামর্শ অনুযায়ী ওষুধ',
      descriptionEn: 'Medicines as per doctor prescription',
      icon: '💊',
      isActive: true,
    },
    {
      slug: 'daily-otc',
      nameBn: 'দৈনন্দিন ও OTC',
      nameEn: 'Daily & OTC',
      descriptionBn: 'প্রতিদিনের প্রয়োজনীয় ওষুধ',
      descriptionEn: 'Over-the-counter medicines',
      icon: '🏥',
      isActive: true,
    },
    {
      slug: 'chronic',
      nameBn: 'ক্রনিক কেয়ার',
      nameEn: 'Chronic Care',
      descriptionBn: 'দীর্ঘমেয়াদী রোগের ওষুধ',
      descriptionEn: 'Long-term disease management',
      icon: '💉',
      isActive: true,
    },
    {
      slug: 'baby-mom',
      nameBn: 'বেবি ও মা কেয়ার',
      nameEn: 'Baby & Mom Care',
      descriptionBn: 'শিশু ও মায়েদের যত্ন',
      descriptionEn: 'Baby and mother care products',
      icon: '👶',
      isActive: true,
    },
    {
      slug: 'women',
      nameBn: 'নারী স্বাস্থ্য',
      nameEn: "Women's Care",
      descriptionBn: 'মহিলাদের স্বাস্থ্য পণ্য',
      descriptionEn: "Women's health products",
      icon: '🌸',
      isActive: true,
    },
    {
      slug: 'emergency',
      nameBn: 'জরুরি প্রয়োজন',
      nameEn: 'Emergency Needs',
      descriptionBn: 'জরুরি স্বাস্থ্য সেবা',
      descriptionEn: 'Emergency healthcare',
      icon: '🚨',
      isActive: true,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Categories created');

  // Create delivery zones
  const zones = [
    {
      slug: 'gazipur',
      nameBn: 'গাজীপুর',
      nameEn: 'Gazipur',
      fee: new Decimal(50),
      estimatedTimeBn: '১-২ ঘণ্টা',
      estimatedTimeEn: '1-2 hours',
      isActive: true,
    },
    {
      slug: 'tongi',
      nameBn: 'টোঙ্গী',
      nameEn: 'Tongi',
      fee: new Decimal(40),
      estimatedTimeBn: '১ ঘণ্টা',
      estimatedTimeEn: '1 hour',
      isActive: true,
    },
    {
      slug: 'mymensingh',
      nameBn: 'ময়মনসিংহ',
      nameEn: 'Mymensingh',
      fee: new Decimal(80),
      estimatedTimeBn: '২-৩ ঘণ্টা',
      estimatedTimeEn: '2-3 hours',
      isActive: true,
    },
    {
      slug: 'tangail',
      nameBn: 'টাঙ্গাইল',
      nameEn: 'Tangail',
      fee: new Decimal(70),
      estimatedTimeBn: '২-৩ ঘণ্টা',
      estimatedTimeEn: '2-3 hours',
      isActive: true,
    },
  ];

  for (const zone of zones) {
    await prisma.deliveryZone.upsert({
      where: { slug: zone.slug },
      update: {},
      create: zone,
    });
  }

  console.log('✅ Delivery zones created');

  // Get first category for medicines
  const prescriptionCategory = await prisma.category.findUnique({
    where: { slug: 'prescription' },
  });

  if (!prescriptionCategory) {
    console.error('❌ Category not found');
    process.exit(1);
  }

  // Create sample medicines
  const medicines = [
    {
      nameBn: 'প্যারাসিটামল ৫০০ এমজি',
      nameEn: 'Paracetamol 500mg',
      genericNameBn: 'প্যারাসিটামল',
      genericNameEn: 'Paracetamol',
      categoryId: prescriptionCategory.id,
      subcategory: 'tablet',
      packSize: 10,
      originalPricePerPack: new Decimal(50),
      pricePerPack: new Decimal(50),
      pricePerUnit: new Decimal(5),
      stockQuantity: 100,
      requiresPrescription: false,
      dosageForm: 'Tablet',
      strength: '500mg',
      manufacturer: 'Beximco Pharmaceuticals',
      isSensitive: false,
      isActive: true,
    },
    {
      nameBn: 'অ্যামোক্সিসিলিন ৫০০ এমজি',
      nameEn: 'Amoxicillin 500mg',
      genericNameBn: 'অ্যামোক্সিসিলিন',
      genericNameEn: 'Amoxicillin',
      categoryId: prescriptionCategory.id,
      subcategory: 'capsule',
      packSize: 10,
      originalPricePerPack: new Decimal(120),
      pricePerPack: new Decimal(100),
      pricePerUnit: new Decimal(10),
      stockQuantity: 50,
      requiresPrescription: true,
      dosageForm: 'Capsule',
      strength: '500mg',
      manufacturer: 'Square Pharmaceuticals',
      isSensitive: false,
      hasDiscount: true,
      discountType: 'FIXED_AMOUNT',
      discountValue: new Decimal(20),
      isActive: true,
    },
  ];

  for (const med of medicines) {
    await prisma.medicine.upsert({
      where: { sku: med.nameEn.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: med,
    });
  }

  console.log('✅ Sample medicines created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Helper for Decimal type
import { Decimal } from '@prisma/client/runtime/library';
