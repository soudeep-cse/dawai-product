import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { protectAdminRoute } from '@/lib/middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const createMedicineSchema = z.object({
  nameBn: z.string().min(1),
  nameEn: z.string().min(1),
  genericNameBn: z.string().optional(),
  genericNameEn: z.string().optional(),
  categoryId: z.string().min(1),
  subcategory: z.string().optional(),
  packSize: z.number().min(1),
  originalPricePerPack: z.number().min(0),
  pricePerPack: z.number().min(0),
  pricePerUnit: z.number().min(0),
  hasDiscount: z.boolean().default(false),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y']).optional(),
  discountValue: z.number().min(0).optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
  stockQuantity: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(10),
  reorderLevel: z.number().min(0).default(20),
  requiresPrescription: z.boolean().default(false),
  dosageForm: z.string().min(1),
  strength: z.string().optional(),
  manufacturer: z.string().optional(),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
  usageBn: z.string().optional(),
  usageEn: z.string().optional(),
  sideEffectsBn: z.string().optional(),
  sideEffectsEn: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  primaryImage: z.string().optional(),
});

// GET - List all medicines (admin view with more details)
export async function GET(request: NextRequest) {
  try {
    await protectAdminRoute(request);

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
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

// POST - Create new medicine
export async function POST(request: NextRequest) {
  try {
    await protectAdminRoute(request);

    const body = await request.json();
    const validated = createMedicineSchema.parse(body);

    const medicine = await prisma.medicine.create({
      data: {
        ...validated,
        discountStartDate: validated.discountStartDate ? new Date(validated.discountStartDate) : null,
        discountEndDate: validated.discountEndDate ? new Date(validated.discountEndDate) : null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: medicine,
        message: 'Medicine created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create medicine error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create medicine',
      },
      { status: 500 }
    );
  }
}
