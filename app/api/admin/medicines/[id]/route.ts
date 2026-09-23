import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { protectAdminRoute } from '@/lib/middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateMedicineSchema = z.object({
  nameBn: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  genericNameBn: z.string().optional(),
  genericNameEn: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  subcategoryId: z.string().optional(),
  packSize: z.number().min(1).optional(),
  originalPricePerPack: z.number().min(0).optional(),
  pricePerPack: z.number().min(0).optional(),
  pricePerUnit: z.number().min(0).optional(),
  hasDiscount: z.boolean().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y']).optional(),
  discountValue: z.number().min(0).optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
  stockQuantity: z.number().min(0).optional(),
  lowStockThreshold: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
  requiresPrescription: z.boolean().optional(),
  dosageForm: z.string().min(1).optional(),
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
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  primaryImage: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single medicine
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        subcategory: true,
        batches: true,
      },
    });

    if (!medicine) {
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

// PATCH - Update medicine
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const body = await request.json();
    const validated = updateMedicineSchema.parse(body);

    const updateData: any = { ...validated };
    if (validated.discountStartDate) {
      updateData.discountStartDate = new Date(validated.discountStartDate);
    }
    if (validated.discountEndDate) {
      updateData.discountEndDate = new Date(validated.discountEndDate);
    }

    const medicine = await prisma.medicine.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: medicine,
        message: 'Medicine updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update medicine error:', error);

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

    if (error.code === 'P2025') {
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
        success: false,
        error: 'Failed to update medicine',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete medicine (soft delete by setting isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const medicine = await prisma.medicine.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json(
      {
        success: true,
        data: medicine,
        message: 'Medicine deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete medicine error:', error);

    if (error.code === 'P2025') {
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
        success: false,
        error: 'Failed to delete medicine',
      },
      { status: 500 }
    );
  }
}
