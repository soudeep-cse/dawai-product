import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q || q.length < 2) {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        { status: 200 }
      );
    }

    const medicines = await prisma.medicine.findMany({
      where: {
        isActive: true,
        OR: [
          { nameBn: { contains: q, mode: 'insensitive' } },
          { nameEn: { contains: q, mode: 'insensitive' } },
          { genericNameBn: { contains: q, mode: 'insensitive' } },
          { genericNameEn: { contains: q, mode: 'insensitive' } },
        ],
      },
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
            nameBn: true,
            nameEn: true,
          },
        },
      },
      take: 20,
    });

    return NextResponse.json(
      {
        success: true,
        data: medicines,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search medicines error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search medicines',
      },
      { status: 500 }
    );
  }
}
