import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getCustomerIdFromRequest } from '@/lib/customerAuth';

const prisma = new PrismaClient();

const updateAddressSchema = z.object({
  label: z.string().min(1).optional(),
  address: z.string().min(5).optional(),
  zoneId: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// PATCH - Update one of the logged-in customer's saved addresses
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = getCustomerIdFromRequest(request);
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.customerAddress.findUnique({ where: { id: params.id } });
    if (!existing || existing.customerId !== customerId) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = updateAddressSchema.parse(body);

    if (validated.isDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.customerAddress.update({
      where: { id: params.id },
      data: validated,
      include: { zone: true },
    });

    if (validated.isDefault) {
      await prisma.customer.update({
        where: { id: customerId },
        data: { defaultAddress: address.address, defaultZoneId: address.zoneId },
      });
    }

    return NextResponse.json(
      { success: true, data: address, message: 'Address updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update address error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE - Remove one of the logged-in customer's saved addresses
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = getCustomerIdFromRequest(request);
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.customerAddress.findUnique({ where: { id: params.id } });
    if (!existing || existing.customerId !== customerId) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    await prisma.customerAddress.delete({ where: { id: params.id } });

    return NextResponse.json(
      { success: true, message: 'Address deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
