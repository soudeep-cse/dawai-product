const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDeliveryZones() {
  try {
    const zones = [
      {
        slug: 'gazipur',
        nameBn: 'গাজীপুর',
        nameEn: 'Gazipur',
        fee: 50,
        estimatedTimeBn: '১-২ ঘণ্টা',
        estimatedTimeEn: '1-2 hours',
        sortOrder: 1,
      },
      {
        slug: 'tongi',
        nameBn: 'টঙ্গী',
        nameEn: 'Tongi',
        fee: 40,
        estimatedTimeBn: '১ ঘণ্টা',
        estimatedTimeEn: '1 hour',
        sortOrder: 2,
      },
      {
        slug: 'mymensingh',
        nameBn: 'ময়মনসিংহ',
        nameEn: 'Mymensingh',
        fee: 80,
        estimatedTimeBn: '২-৩ ঘণ্টা',
        estimatedTimeEn: '2-3 hours',
        sortOrder: 3,
      },
      {
        slug: 'tangail',
        nameBn: 'টাঙ্গাইল',
        nameEn: 'Tangail',
        fee: 70,
        estimatedTimeBn: '২-৩ ঘণ্টা',
        estimatedTimeEn: '2-3 hours',
        sortOrder: 4,
      },
    ];

    for (const zone of zones) {
      await prisma.deliveryZone.upsert({
        where: { slug: zone.slug },
        update: {},
        create: zone,
      });
    }

    console.log(`✅ Seeded ${zones.length} delivery zones`);
  } catch (error) {
    console.error('Error seeding delivery zones:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDeliveryZones();
