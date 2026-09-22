import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { customerId };
    if (status) {
      where.status = status;
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: {
          items: {
            include: { medicine: true },
          },
          order: true,
          pharmacist: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.prescription.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          prescriptions,
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get prescriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}
