import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  customerPhone: z.string().min(11),
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  deliveryZoneId: z.string().min(1),
  deliveryAddress: z.string().min(5),
  items: z.array(
    z.object({
      medicineId: z.string(),
      quantity: z.number().min(1),
      pricePerUnit: z.number().min(0),
    })
  ),
  totalAmount: z.number().min(0),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'BKASH', 'NAGAD', 'CARD']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerPhone: validated.customerPhone,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        deliveryZoneId: validated.deliveryZoneId,
        deliveryAddress: validated.deliveryAddress,
        totalAmount: validated.totalAmount,
        paymentMethod: validated.paymentMethod as any,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        items: {
          create: validated.items.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
            subtotal: item.pricePerUnit * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
        deliveryZone: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);

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
        error: 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

// GET - Get order by ID or customer phone
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const customerPhone = searchParams.get('customerPhone');

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
          deliveryZone: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: 'Order not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: order,
        },
        { status: 200 }
      );
    }

    if (customerPhone) {
      const orders = await prisma.order.findMany({
        where: { customerPhone },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
          deliveryZone: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return NextResponse.json(
        {
          success: true,
          data: orders,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Please provide orderId or customerPhone',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}
