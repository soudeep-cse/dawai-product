import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getCustomerIdFromRequest } from '@/lib/customerAuth';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  deliveryPhone: z.string().min(11),
  deliveryZoneId: z.string().min(1),
  deliveryAddress: z.string().min(5),
  items: z.array(
    z.object({
      medicineId: z.string(),
      quantity: z.number().min(1),
      pricePerUnit: z.number().min(0),
    })
  ),
  paymentMethod: z.enum(['COD', 'BKASH', 'NAGAD', 'CARD']),
});

export async function POST(request: NextRequest) {
  try {
    // Placing an order requires a logged-in customer - customerId comes
    // only from their verified token, never from the request body, so a
    // guest can't place an order under someone else's account. The
    // delivery contact phone is separate (Google logins have no phone at
    // all) and is just where the rider calls, not an identity claim.
    const customerId = getCustomerIdFromRequest(request);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Please log in to place an order' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    const existingCustomer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Please log in to place an order' },
        { status: 401 }
      );
    }

    // Fetch medicine details to snapshot into order items
    const medicineIds = validated.items.map((item) => item.medicineId);
    const medicines = await prisma.medicine.findMany({
      where: { id: { in: medicineIds } },
    });
    const medicineMap = new Map(medicines.map((m) => [m.id, m]));

    for (const item of validated.items) {
      if (!medicineMap.has(item.medicineId)) {
        return NextResponse.json(
          { success: false, error: `Medicine not found: ${item.medicineId}` },
          { status: 400 }
        );
      }
    }

    const zone = await prisma.deliveryZone.findUnique({
      where: { id: validated.deliveryZoneId },
    });

    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Delivery zone not found' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: { name: validated.customerName },
    });

    const subtotal = validated.items.reduce(
      (sum, item) => sum + item.pricePerUnit * item.quantity,
      0
    );
    const deliveryFee = Number(zone.fee);
    const total = subtotal + deliveryFee;
    const hasSensitiveItem = validated.items.some(
      (item) => medicineMap.get(item.medicineId)!.isSensitive
    );
    const orderNumber = `DW${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        phone: validated.deliveryPhone,
        address: validated.deliveryAddress,
        zoneId: validated.deliveryZoneId,
        status: 'PENDING',
        paymentMethod: validated.paymentMethod as any,
        paymentStatus: 'PENDING',
        subtotal,
        deliveryFee,
        total,
        hasSensitiveItem,
        items: {
          create: validated.items.map((item) => {
            const medicine = medicineMap.get(item.medicineId)!;
            return {
              medicineId: item.medicineId,
              nameBn: medicine.nameBn,
              nameEn: medicine.nameEn,
              isSensitive: medicine.isSensitive,
              quantity: item.quantity,
              pricePerUnit: item.pricePerUnit,
              lineTotal: item.pricePerUnit * item.quantity,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
        zone: true,
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
          zone: true,
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
        where: { phone: customerPhone },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
          zone: true,
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
