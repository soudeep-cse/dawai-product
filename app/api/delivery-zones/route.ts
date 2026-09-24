import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        nameEn: true,
        nameBn: true,
        slug: true,
        fee: true,
        estimatedTimeBn: true,
        estimatedTimeEn: true,
        isActive: true,
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        // Prisma Decimal fields serialize to strings over JSON, which
        // silently turns `total + fee` into string concatenation on the
        // client - convert to a real number here so every consumer gets
        // an actual number instead of having to remember to coerce it.
        data: zones.map((zone) => ({ ...zone, fee: Number(zone.fee) })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get delivery zones error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch delivery zones',
      },
      { status: 500 }
    );
  }
}
