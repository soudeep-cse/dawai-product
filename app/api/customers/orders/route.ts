import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCustomerIdFromRequest } from '@/lib/customerAuth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromRequest(request);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { customerId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { medicine: true },
          },
          zone: true,
          prescription: {
            include: { items: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          orders,
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
