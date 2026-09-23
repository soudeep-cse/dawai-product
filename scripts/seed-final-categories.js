const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedFinalCategories() {
  try {
    console.log('🗑️ Cleaning old data...');
    await prisma.medicine.deleteMany({});
    await prisma.subcategory.deleteMany({});
    await prisma.category.deleteMany({});

    // Main categories - exactly 6
    const mainCategories = [
      {
        slug: 'prescription-medicine',
        nameEn: 'Prescription Medicine',
        nameBn: 'প্রেসক্রিপশন মেডিসিন',
        descriptionEn: 'Medicines requiring doctor prescription',
        descriptionBn: 'ডাক্তারের প্রেসক্রিপশন প্রয়োজন',
        icon: '📋',
        sortOrder: 1,
      },
      {
        slug: 'daily-otc',
        nameEn: 'Daily & OTC',
        nameBn: 'দৈনিক ও OTC',
        descriptionEn: 'Over-the-counter medicines',
        descriptionBn: 'প্রেসক্রিপশন ছাড়াই কিনতে পারবেন',
        icon: '💊',
        sortOrder: 2,
      },
      {
        slug: 'chronic-care',
        nameEn: 'Chronic Care',
        nameBn: 'ক্রনিক কেয়ার',
        descriptionEn: 'Long-term disease management',
        descriptionBn: 'দীর্ঘমেয়াদী রোগ নিয়ন্ত্রণ',
        icon: '❤️',
        sortOrder: 3,
      },
      {
        slug: 'baby-mom-care',
        nameEn: 'Baby & Mom Care',
        nameBn: 'শিশু ও মা যত্ন',
        descriptionEn: 'Products for babies and mothers',
        descriptionBn: 'শিশু ও মাদের জন্য পণ্য',
        icon: '👶',
        sortOrder: 4,
      },
      {
        slug: 'womens-care',
        nameEn: 'Women\'s Care',
        nameBn: 'নারী যত্ন',
        descriptionEn: 'Women health and hygiene',
        descriptionBn: 'মহিলাদের স্বাস্থ্য ও স্বাস্থ্যবিধি',
        icon: '🌸',
        sortOrder: 5,
      },
      {
        slug: 'emergency-needs',
        nameEn: 'Emergency Needs',
        nameBn: 'জরুরি প্রয়োজন',
        descriptionEn: 'Emergency contraception and protection',
        descriptionBn: 'জরুরি গর্ভনিরোধ এবং সুরক্ষা',
        icon: '🚨',
        sortOrder: 6,
      },
    ];

    console.log('📚 Creating main categories...');
    await prisma.category.createMany({
      data: mainCategories,
    });

    // Get all categories
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

    // Sub-categories with exact names from user
    const subCategoriesData = [
      // Prescription Medicine
      {
        categorySlug: 'prescription-medicine',
        slug: 'tablets',
        nameEn: 'Tablets',
        nameBn: 'ট্যাবলেট',
        icon: '💊',
        sortOrder: 1,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'syrups',
        nameEn: 'Syrups',
        nameBn: 'সিরাপ',
        icon: '🧪',
        sortOrder: 2,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'injections',
        nameEn: 'Injections',
        nameBn: 'ইনজেকশন',
        icon: '💉',
        sortOrder: 3,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'inhalers',
        nameEn: 'Inhalers',
        nameBn: 'ইনহেলার',
        icon: '💨',
        sortOrder: 4,
      },
      {
        categorySlug: 'prescription-medicine',
        slug: 'insulin',
        nameEn: 'Insulin',
        nameBn: 'ইনসুলিন',
        icon: '💉',
        sortOrder: 5,
      },

      // Daily & OTC
      {
        categorySlug: 'daily-otc',
        slug: 'fever-cold',
        nameEn: 'Fever & Cold',
        nameBn: 'জ্বর ও ঠান্ডা',
        icon: '🤧',
        sortOrder: 1,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'pain-relief',
        nameEn: 'Pain Relief',
        nameBn: 'ব্যথা নিরাময়',
        icon: '💊',
        sortOrder: 2,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'gastric-digestive',
        nameEn: 'Gastric & Digestive',
        nameBn: 'গ্যাস্ট্রিক ও হজম',
        icon: '🍽️',
        sortOrder: 3,
      },
      {
        categorySlug: 'daily-otc',
        slug: 'ointment',
        nameEn: 'Ointment',
        nameBn: 'মলম',
        icon: '🧴',
        sortOrder: 4,
      },

      // Chronic Care
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
        slug: 'blood-pressure',
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
        slug: 'heart-cardiac',
        nameEn: 'Heart/Cardiac',
        nameBn: 'হৃদয়/কার্ডিয়াক',
        icon: '❤️',
        sortOrder: 4,
      },

      // Baby & Mom Care
      {
        categorySlug: 'baby-mom-care',
        slug: 'baby-formula-milk',
        nameEn: 'Baby Formula/Milk',
        nameBn: 'শিশু ফর্মুলা/দুধ',
        icon: '🍼',
        sortOrder: 1,
      },
      {
        categorySlug: 'baby-mom-care',
        slug: 'diapers',
        nameEn: 'Diapers',
        nameBn: 'ডায়াপার',
        icon: '👶',
        sortOrder: 2,
      },
      {
        categorySlug: 'baby-mom-care',
        slug: 'baby-skin-care',
        nameEn: 'Baby Skin Care',
        nameBn: 'শিশু ত্বক যত্ন',
        icon: '🧴',
        sortOrder: 3,
      },
      {
        categorySlug: 'baby-mom-care',
        slug: 'prenatal-vitamins',
        nameEn: 'Prenatal Vitamins',
        nameBn: 'প্রসবপূর্ব ভিটামিন',
        icon: '🤰',
        sortOrder: 4,
      },
      {
        categorySlug: 'baby-mom-care',
        slug: 'maternity-care',
        nameEn: 'Maternity Care',
        nameBn: 'প্রসবোত্তর যত্ন',
        icon: '👩‍🍼',
        sortOrder: 5,
      },
      {
        categorySlug: 'baby-mom-care',
        slug: 'wet-tissue',
        nameEn: 'Wet Tissue/Tissue',
        nameBn: 'ভেজা টিস্যু/টিস্যু',
        icon: '🧻',
        sortOrder: 6,
      },

      // Women's Care
      {
        categorySlug: 'womens-care',
        slug: 'sanitary-products',
        nameEn: 'Sanitary Products (Pads)',
        nameBn: 'স্যানিটারি পণ্য (প্যাড)',
        icon: '🌸',
        sortOrder: 1,
      },
      {
        categorySlug: 'womens-care',
        slug: 'feminine-hygiene',
        nameEn: 'Feminine Hygiene',
        nameBn: 'নারী স্বাস্থ্যবিধি',
        icon: '🧼',
        sortOrder: 2,
      },
      {
        categorySlug: 'womens-care',
        slug: 'womens-vitamins',
        nameEn: 'Women\'s Vitamins/Supplements',
        nameBn: 'নারী ভিটামিন/সম্পূরক',
        icon: '💊',
        sortOrder: 3,
      },
      {
        categorySlug: 'womens-care',
        slug: 'pregnancy-kits',
        nameEn: 'Pregnancy Kits',
        nameBn: 'গর্ভধারণ পরীক্ষার কিট',
        icon: '🧬',
        sortOrder: 4,
      },

      // Emergency Needs
      {
        categorySlug: 'emergency-needs',
        slug: 'emergency-contraceptive',
        nameEn: 'Emergency Contraceptive Pill',
        nameBn: 'জরুরি গর্ভনিরোধক বড়ি',
        icon: '⚠️',
        sortOrder: 1,
      },
      {
        categorySlug: 'emergency-needs',
        slug: 'condoms',
        nameEn: 'Condoms',
        nameBn: 'কনডম',
        icon: '💓',
        sortOrder: 2,
      },
      {
        categorySlug: 'emergency-needs',
        slug: 'lubricant-gel',
        nameEn: 'Lubricant/Gel',
        nameBn: 'লুব্রিকেন্ট/জেল',
        icon: '💧',
        sortOrder: 3,
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

    console.log('✅ Database updated successfully with correct categories!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFinalCategories();
