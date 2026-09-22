import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const createAddressSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(5),
  zoneId: z.string(),
  isDefault: z.boolean().default(false),
});

function getCustomerIdFromToken(request: NextRequest): string | null {
  const token = request.cookies.get('customer-token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded.customerId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromToken(request);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId },
      include: { zone: true },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json(
      { success: true, data: addresses },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get addresses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromToken(request);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createAddressSchema.parse(body);

    // If setting as default, unset other defaults
    if (validated.isDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.customerAddress.create({
      data: {
        customerId,
        ...validated,
      },
      include: { zone: true },
    });

    // Update customer default if needed
    if (validated.isDefault) {
      await prisma.customer.update({
        where: { id: customerId },
        data: { defaultAddress: validated.address },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: address,
        message: 'Address added successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create address error:', error);

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
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    );
  }
}
