import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    console.log('Fetching subcategories for categoryId:', categoryId);

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID required' },
        { status: 400 }
      );
    }

    const subcategories = await prisma.subcategory.findMany({
      where: {
        categoryId: categoryId,
      },
      orderBy: { sortOrder: 'asc' },
    });

    console.log('Found subcategories:', subcategories.length);

    return NextResponse.json(
      { success: true, subcategories },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch subcategories error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
