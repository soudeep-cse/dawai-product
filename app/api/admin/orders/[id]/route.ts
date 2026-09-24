import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { protectAdminRoute } from '@/lib/middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
});

// GET - Get single order detail (admin view)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: { include: { addresses: true } },
        zone: true,
        items: { include: { medicine: true } },
        prescription: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Get admin order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await protectAdminRoute(request);

    const body = await request.json();
    const validated = updateOrderSchema.parse(body);

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: validated.status },
      include: { customer: true, zone: true },
    });

    return NextResponse.json(
      { success: true, data: order, message: 'Order status updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update order error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
