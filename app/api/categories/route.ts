import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        nameBn: true,
        nameEn: true,
        descriptionBn: true,
        descriptionEn: true,
        icon: true,
        sortOrder: true,
        hasDiscount: true,
        discountType: true,
        discountValue: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
