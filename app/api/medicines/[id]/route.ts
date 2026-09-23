import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        subcategory: true,
        batches: {
          where: { expiryDate: { gt: new Date() } },
          select: {
            id: true,
            batchNumber: true,
            expiryDate: true,
            quantity: true,
          },
        },
      },
    });

    if (!medicine || !medicine.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Medicine not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: medicine,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get medicine error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch medicine',
      },
      { status: 500 }
    );
  }
}
