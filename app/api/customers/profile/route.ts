import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getCustomerIdFromRequest } from '@/lib/customerAuth';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  defaultZoneId: z.string().optional(),
  defaultAddress: z.string().min(5).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromRequest(request);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        addresses: true,
        defaultZone: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromRequest(request);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: validated.name,
        defaultZoneId: validated.defaultZoneId,
        defaultAddress: validated.defaultAddress,
      },
      include: {
        addresses: true,
        defaultZone: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: customer,
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update profile error:', error);

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
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
