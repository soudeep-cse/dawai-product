import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { protectAdminRoute } from '@/lib/middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const createZoneSchema = z.object({
  slug: z.string().min(1),
  nameBn: z.string().min(1),
  nameEn: z.string().min(1),
  fee: z.number().min(0),
  estimatedTimeBn: z.string().min(1),
  estimatedTimeEn: z.string().min(1),
  sortOrder: z.number().default(0),
});

// GET - List all delivery zones (including inactive, for admin management)
export async function GET(request: NextRequest) {
  try {
    await protectAdminRoute(request);

    const zones = await prisma.deliveryZone.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: zones }, { status: 200 });
  } catch (error) {
    console.error('Get delivery zones error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch delivery zones' },
      { status: 500 }
    );
  }
}

// POST - Create a new delivery zone
export async function POST(request: NextRequest) {
  try {
    await protectAdminRoute(request);

    const body = await request.json();
    const validated = createZoneSchema.parse(body);

    const zone = await prisma.deliveryZone.create({ data: validated });

    return NextResponse.json(
      { success: true, data: zone, message: 'Delivery zone created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create delivery zone error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A zone with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create delivery zone' },
      { status: 500 }
    );
  }
}
