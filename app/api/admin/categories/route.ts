import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createCategorySchema = z.object({
  nameEn: z.string().min(1, 'English name required'),
  nameBn: z.string().min(1, 'Bengali name required'),
  slug: z.string().min(1, 'Slug required'),
  icon: z.string().min(1, 'Icon/emoji required'),
  descriptionEn: z.string().optional(),
  descriptionBn: z.string().optional(),
});

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(
      { success: true, categories },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createCategorySchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        nameEn: data.nameEn,
        nameBn: data.nameBn,
        slug: data.slug,
        icon: data.icon,
        descriptionEn: data.descriptionEn || '',
        descriptionBn: data.descriptionBn || '',
      },
    });

    return NextResponse.json(
      { success: true, category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create category error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
