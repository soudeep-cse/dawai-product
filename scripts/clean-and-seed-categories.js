const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanAndSeed() {
  try {
    console.log('🗑️ Cleaning old data...');
    await prisma.medicine.deleteMany({});
    await prisma.subcategory.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('✓ Database cleaned');

    // Create only 6 main categories
    const mainCategories = [
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
        slug: 'daily-otc',
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
        icon: '❤️',
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
        icon: '🌸',
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
    ];

    console.log('📚 Creating main categories...');
    const categories = await prisma.category.createMany({
      data: mainCategories,
    });

    console.log('✓ Main categories created');

    // Get created categories
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

    // Sub-categories mapped to their parent categories
    const subCategoriesData = [
      // Prescription Medicine sub-categories
      {
        categorySlug: 'prescription-medicine',
        slug: 'prescription-tablets',
        nameEn: 'Tablets',
        nameBn: 'ট্যাবলেট',
        icon: '💊',
        sortOrder: 1,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'prescription-capsules',
        nameEn: 'Capsules',
        nameBn: 'ক্যাপসুল',
        icon: '💊',
        sortOrder: 2,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'prescription-injections',
        nameEn: 'Injections',
        nameBn: 'ইনজেকশন',
        icon: '💉',
        sortOrder: 3,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'prescription-liquids',
        nameEn: 'Liquids/Syrups',
        nameBn: 'তরল/সিরাপ',
        icon: '🧪',
        sortOrder: 4,
      },

      // Daily & OTC sub-categories
      {
        categorySlug: 'daily-otc',
        slug: 'pain-relief',
        nameEn: 'Pain Relief',
        nameBn: 'ব্যথা নিরাময়',
        icon: '💊',
        sortOrder: 1,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'cold-cough',
        nameEn: 'Cold & Cough',
        nameBn: 'ঠান্ডা ও কাশি',
        icon: '🤧',
        sortOrder: 2,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'oils',
        nameEn: 'Oils',
        nameBn: 'তেল',
        icon: '🧴',
        sortOrder: 3,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'creams',
        nameEn: 'Creams & Ointments',
        nameBn: 'ক্রিম ও মলম',
        icon: '🧴',
        sortOrder: 4,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'digestion',
        nameEn: 'Digestion',
        nameBn: 'হজম সম্বন্ধীয়',
        icon: '🍽️',
        sortOrder: 5,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'skincare',
        nameEn: 'Skin Care',
        nameBn: 'ত্বক পরিচর্যা',
        icon: '🧴',
        sortOrder: 6,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'vitamins',
        nameEn: 'Vitamins & Supplements',
        nameBn: 'ভিটামিন ও পুষ্টি সম্পূরক',
        icon: '🥗',
        sortOrder: 7,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'sexual-health',
        nameEn: 'Sexual Health',
        nameBn: 'যৌন স্বাস্থ্য',
        icon: '❤️',
        sortOrder: 8,
      },

      // Chronic Care sub-categories
      {
        categorySlug: 'chronic-care',
        slug: 'diabetes',
        nameEn: 'Diabetes',
        nameBn: 'ডায়াবেটিস',
        icon: '🩺',
        sortOrder: 1,
      },
      {
        categorySlug: 'chronic-care',
        slug: 'hypertension',
        nameEn: 'Blood Pressure',
        nameBn: 'রক্তচাপ',
        icon: '❤️',
        sortOrder: 2,
      },
      {
        categorySlug: 'chronic-care',
        slug: 'thyroid',
        nameEn: 'Thyroid',
        nameBn: 'থাইরয়েড',
        icon: '🩺',
        sortOrder: 3,
      },
      {
        categorySlug: 'chronic-care',
        slug: 'heart',
        nameEn: 'Heart',
        nameBn: 'হৃদয়',
        icon: '❤️',
        sortOrder: 4,
      },

      // Child & Mother sub-categories
      {
        categorySlug: 'child-mother',
        slug: 'baby-formula',
        nameEn: 'Baby Formula',
        nameBn: 'শিশু ফর্মুলা',
        icon: '🍼',
        sortOrder: 1,
      },
      {
        categorySlug: 'child-mother',
        slug: 'diapers',
        nameEn: 'Diapers',
        nameBn: 'ডায়াপার',
        icon: '👶',
        sortOrder: 2,
      },
      {
        categorySlug: 'child-mother',
        slug: 'prenatal',
        nameEn: 'Prenatal Vitamins',
        nameBn: 'প্রসবপূর্ব ভিটামিন',
        icon: '🤰',
        sortOrder: 3,
      },
      {
        categorySlug: 'child-mother',
        slug: 'baby-care',
        nameEn: 'Baby Care',
        nameBn: 'শিশু যত্ন',
        icon: '🧴',
        sortOrder: 4,
      },

      // Women's Health sub-categories
      {
        categorySlug: 'womens-health',
        slug: 'sanitary-products',
        nameEn: 'Sanitary Products',
        nameBn: 'স্যানিটারি পণ্য',
        icon: '🌸',
        sortOrder: 1,
      },
      {
        categorySlug: 'womens-health',
        slug: 'contraceptives',
        nameEn: 'Contraceptives',
        nameBn: 'জন্মনিয়ন্ত্রণ',
        icon: '💓',
        sortOrder: 2,
      },
      {
        categorySlug: 'womens-health',
        slug: 'pregnancy-tests',
        nameEn: 'Pregnancy Tests',
        nameBn: 'গর্ভধারণ পরীক্ষা',
        icon: '🧬',
        sortOrder: 3,
      },

      // Emergency Need sub-categories
      {
        categorySlug: 'emergency-need',
        slug: 'first-aid',
        nameEn: 'First Aid',
        nameBn: 'প্রাথমিক চিকিৎসা',
        icon: '🚨',
        sortOrder: 1,
      },
      {
        categorySlug: 'emergency-need',
        slug: 'emergency-medicines',
        nameEn: 'Emergency Medicines',
        nameBn: 'জরুরি ওষুধ',
        icon: '⚠️',
        sortOrder: 2,
      },
    ];

    console.log('📚 Creating sub-categories...');
    for (const sub of subCategoriesData) {
      const categoryId = categoryMap.get(sub.categorySlug);
      if (!categoryId) {
        console.warn(`⚠️ Category not found: ${sub.categorySlug}`);
        continue;
      }

      await prisma.subcategory.create({
        data: {
          categoryId,
          slug: sub.slug,
          nameEn: sub.nameEn,
          nameBn: sub.nameBn,
          icon: sub.icon,
          sortOrder: sub.sortOrder,
        },
      });
    }

    console.log('✓ Sub-categories created');
    console.log('✅ Database cleaned and reseeded successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndSeed();
