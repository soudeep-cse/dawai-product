const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSubcategories() {
  try {
    // Check if subcategories already exist
    const existingCount = await prisma.subcategory.count();
    if (existingCount > 0) {
      console.log('✓ Subcategories already exist');
      return;
    }

    const subcategories = [
      // Prescription Medicine
      {
        categoryName: 'Prescription Medicine',
        slug: 'tablets',
        nameEn: 'Tablets',
        nameBn: 'ট্যাবলেট',
        icon: '💊',
        sortOrder: 1,
      },
      {
        categoryName: 'Prescription Medicine',
        slug: 'capsules',
        nameEn: 'Capsules',
        nameBn: 'ক্যাপসুল',
        icon: '💊',
        sortOrder: 2,
      },
      {
        categoryName: 'Prescription Medicine',
        slug: 'injections',
        nameEn: 'Injections',
        nameBn: 'ইনজেকশন',
        icon: '💉',
        sortOrder: 3,
      },
      {
        categoryName: 'Prescription Medicine',
        slug: 'liquids',
        nameEn: 'Liquids/Syrups',
        nameBn: 'তরল/সিরাপ',
        icon: '🧪',
        sortOrder: 4,
      },

      // Daily & OTC
      {
        categoryName: 'Daily & OTC',
        slug: 'pain-relief',
        nameEn: 'Pain Relief',
        nameBn: 'ব্যথা নিরাময়',
        icon: '💊',
        sortOrder: 1,
      },
      {
        categoryName: 'Daily & OTC',
        slug: 'cold-cough',
        nameEn: 'Cold & Cough',
        nameBn: 'ঠান্ডা ও কাশি',
        icon: '🤧',
        sortOrder: 2,
      },
      {
        categoryName: 'Daily & OTC',
        slug: 'oils',
        nameEn: 'Oils',
        nameBn: 'তেল',
        icon: '🧴',
        sortOrder: 3,
      },
      {
        categoryName: 'Daily & OTC',
        slug: 'creams',
        nameEn: 'Creams & Ointments',
        nameBn: 'ক্রিম ও মলম',
        icon: '🧴',
        sortOrder: 4,
      },

      // Chronic Care
      {
        categoryName: 'Chronic Care',
        slug: 'diabetes',
        nameEn: 'Diabetes',
        nameBn: 'ডায়াবেটিস',
        icon: '🩺',
        sortOrder: 1,
      },
      {
        categoryName: 'Chronic Care',
        slug: 'hypertension',
        nameEn: 'Blood Pressure',
        nameBn: 'রক্তচাপ',
        icon: '❤️',
        sortOrder: 2,
      },
      {
        categoryName: 'Chronic Care',
        slug: 'thyroid',
        nameEn: 'Thyroid',
        nameBn: 'থাইরয়েড',
        icon: '🩺',
        sortOrder: 3,
      },
      {
        categoryName: 'Chronic Care',
        slug: 'heart',
        nameEn: 'Heart',
        nameBn: 'হৃদয়',
        icon: '❤️',
        sortOrder: 4,
      },

      // Child & Mother
      {
        categoryName: 'Child & Mother',
        slug: 'baby-formula',
        nameEn: 'Baby Formula',
        nameBn: 'শিশু ফর্মুলা',
        icon: '🍼',
        sortOrder: 1,
      },
      {
        categoryName: 'Child & Mother',
        slug: 'diapers',
        nameEn: 'Diapers',
        nameBn: 'ডায়াপার',
        icon: '👶',
        sortOrder: 2,
      },
      {
        categoryName: 'Child & Mother',
        slug: 'prenatal',
        nameEn: 'Prenatal Vitamins',
        nameBn: 'প্রসবপূর্ব ভিটামিন',
        icon: '🤰',
        sortOrder: 3,
      },
      {
        categoryName: 'Child & Mother',
        slug: 'baby-care',
        nameEn: 'Baby Care',
        nameBn: 'শিশু যত্ন',
        icon: '🧴',
        sortOrder: 4,
      },

      // Women's Health
      {
        categoryName: 'Women\'s Health',
        slug: 'sanitary-products',
        nameEn: 'Sanitary Products',
        nameBn: 'স্যানিটারি পণ্য',
        icon: '🌸',
        sortOrder: 1,
      },
      {
        categoryName: 'Women\'s Health',
        slug: 'contraceptives',
        nameEn: 'Contraceptives',
        nameBn: 'জন্মনিয়ন্ত্রণ',
        icon: '💓',
        sortOrder: 2,
      },
      {
        categoryName: 'Women\'s Health',
        slug: 'pregnancy-tests',
        nameEn: 'Pregnancy Tests',
        nameBn: 'গর্ভধারণ পরীক্ষা',
        icon: '🧬',
        sortOrder: 3,
      },

      // Emergency Need
      {
        categoryName: 'Emergency Need',
        slug: 'first-aid',
        nameEn: 'First Aid',
        nameBn: 'প্রাথমিক চিকিৎসা',
        icon: '🚨',
        sortOrder: 1,
      },
      {
        categoryName: 'Emergency Need',
        slug: 'emergency-medicines',
        nameEn: 'Emergency Medicines',
        nameBn: 'জরুরি ওষুধ',
        icon: '⚠️',
        sortOrder: 2,
      },
    ];

    // Get all categories from DB
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map((c) => [c.nameEn, c.id]));

    // Create subcategories
    for (const sub of subcategories) {
      const categoryId = categoryMap.get(sub.categoryName);
      if (!categoryId) {
        console.warn(`⚠️ Category not found: ${sub.categoryName}`);
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

    console.log('✓ Subcategories created successfully');
  } catch (error) {
    console.error('Error seeding subcategories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSubcategories();
