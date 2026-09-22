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
        deliveryCharge: true,
        estimatedDaysMin: true,
        estimatedDaysMax: true,
        isActive: true,
      },
      orderBy: {
        nameEn: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: zones,
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
