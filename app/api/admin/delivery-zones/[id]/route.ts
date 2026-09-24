import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { protectAdminRoute } from '@/lib/middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateZoneSchema = z.object({
  nameBn: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  fee: z.number().min(0).optional(),
  estimatedTimeBn: z.string().min(1).optional(),
  estimatedTimeEn: z.string().min(1).optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

// PATCH - Update a delivery zone (fee, name, active status, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const body = await request.json();
    const validated = updateZoneSchema.parse(body);

    const zone = await prisma.deliveryZone.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(
      { success: true, data: zone, message: 'Delivery zone updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update delivery zone error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Delivery zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update delivery zone' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete a delivery zone (isActive: false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const zone = await prisma.deliveryZone.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json(
      { success: true, data: zone, message: 'Delivery zone deactivated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete delivery zone error:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Delivery zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete delivery zone' },
      { status: 500 }
    );
  }
}
