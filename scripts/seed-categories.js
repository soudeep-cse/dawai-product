const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCategories() {
  try {
    // Check if categories already exist
    const existingCount = await prisma.category.count();
    if (existingCount > 0) {
      console.log('✓ Categories already exist');
      return;
    }

    const categories = [
      {
        slug: 'prescription-medicine',
        nameEn: 'Prescription Medicine',
        nameBn: 'প্রেসক্রিপশন মেডিসিন',
        descriptionEn: 'Medicines that require doctor prescription',
        descriptionBn: 'ডাক্তারের প্রেসক্রিপশন প্রয়োজন এমন ওষুধ',
        icon: '📋',
        sortOrder: 1,
      },
      {
        slug: 'otc-medicine',
        nameEn: 'Daily & OTC',
        nameBn: 'দৈনিক ও OTC',
        descriptionEn: 'Over-the-counter medicines',
        descriptionBn: 'প্রেসক্রিপশন ছাড়াই কিনতে পারবেন এমন ওষুধ',
        icon: '💊',
        sortOrder: 2,
      },
      {
        slug: 'chronic-care',
        nameEn: 'Chronic Care',
        nameBn: 'ক্রনিক কেয়ার',
        descriptionEn: 'Medicines for chronic diseases',
        descriptionBn: 'দীর্ঘমেয়াদী রোগের জন্য ওষুধ',
        icon: '💉',
        sortOrder: 3,
      },
      {
        slug: 'child-mother',
        nameEn: 'Child & Mother',
        nameBn: 'শিশু ও মা',
        descriptionEn: 'Medicines for children and mothers',
        descriptionBn: 'শিশু ও মায়েদের জন্য ওষুধ',
        icon: '👶',
        sortOrder: 4,
      },
      {
        slug: 'womens-health',
        nameEn: 'Women\'s Health',
        nameBn: 'নারী স্বাস্থ্য',
        descriptionEn: 'Women health and hygiene products',
        descriptionBn: 'মহিলাদের স্বাস্থ্য ও স্বাস্থ্যবিধি পণ্য',
        icon: '💄',
        sortOrder: 5,
      },
      {
        slug: 'emergency-need',
        nameEn: 'Emergency Need',
        nameBn: 'জরুরি প্রয়োজন',
        descriptionEn: 'Emergency and first aid medicines',
        descriptionBn: 'জরুরি এবং প্রাথমিক চিকিৎসা ওষুধ',
        icon: '🚨',
        sortOrder: 6,
      },
      {
        slug: 'pain-relief',
        nameEn: 'Pain Relief',
        nameBn: 'ব্যথা নিরাময়',
        descriptionEn: 'Pain relievers and analgesics',
        descriptionBn: 'ব্যথা কমানোর ওষুধ',
        icon: '💊',
        sortOrder: 7,
      },
      {
        slug: 'cold-cough',
        nameEn: 'Cold & Cough',
        nameBn: 'ঠান্ডা ও কাশি',
        descriptionEn: 'Cough and cold medicines',
        descriptionBn: 'ঠান্ডা এবং কাশির ওষুধ',
        icon: '🤧',
        sortOrder: 8,
      },
      {
        slug: 'digestion',
        nameEn: 'Digestion',
        nameBn: 'হজম সম্বন্ধীয়',
        descriptionEn: 'Digestive system medicines',
        descriptionBn: 'হজম তন্ত্রের ওষুধ',
        icon: '🍽️',
        sortOrder: 9,
      },
      {
        slug: 'skincare',
        nameEn: 'Skin Care',
        nameBn: 'ত্বক পরিচর্যা',
        descriptionEn: 'Skin care creams and ointments',
        descriptionBn: 'ত্বকের যত্নের ক্রিম এবং মলম',
        icon: '🧴',
        sortOrder: 10,
      },
      {
        slug: 'vitamin-supplement',
        nameEn: 'Vitamins & Supplements',
        nameBn: 'ভিটামিন ও পুষ্টি সম্পূরক',
        descriptionEn: 'Vitamins and nutritional supplements',
        descriptionBn: 'ভিটামিন এবং পুষ্টি সম্পূরক',
        icon: '🥗',
        sortOrder: 11,
      },
      {
        slug: 'sexual-health',
        nameEn: 'Sexual Health',
        nameBn: 'যৌন স্বাস্থ্য',
        descriptionEn: 'Sexual health products',
        descriptionBn: 'যৌন স্বাস্থ্য পণ্য',
        icon: '❤️',
        sortOrder: 12,
      },
    ];

    const createdCategories = await prisma.category.createMany({
      data: categories,
    });

    console.log('✓ Categories created successfully');
    categories.forEach((cat) => {
      console.log(`  ${cat.icon} ${cat.nameEn}`);
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
