import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateAdminToken } from '@/lib/middleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const payload = await validateAdminToken(request);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Fetch admin from database to get latest data
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin not found or inactive',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        admin,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
