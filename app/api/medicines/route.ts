import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const requiresPrescription = searchParams.get('requiresPrescription');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (categoryId) where.categoryId = categoryId;
    if (requiresPrescription !== null) where.requiresPrescription = requiresPrescription === 'true';
    if (featured !== null) where.featured = featured === 'true';

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        select: {
          id: true,
          nameBn: true,
          nameEn: true,
          genericNameBn: true,
          genericNameEn: true,
          originalPricePerPack: true,
          pricePerPack: true,
          pricePerUnit: true,
          packSize: true,
          dosageForm: true,
          hasDiscount: true,
          discountType: true,
          discountValue: true,
          stockQuantity: true,
          primaryImage: true,
          requiresPrescription: true,
          category: {
            select: {
              id: true,
              nameBn: true,
              nameEn: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.medicine.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: medicines,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get medicines error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch medicines',
      },
      { status: 500 }
    );
  }
}
