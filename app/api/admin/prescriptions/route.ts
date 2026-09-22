import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const reviewPrescriptionSchema = z.object({
  prescriptionId: z.string(),
  status: z.enum(['APPROVED', 'REJECTED', 'NEEDS_CLARIFICATION']),
  pharmacistId: z.string(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        medicineId: z.string().optional(),
        dosage: z.string(),
        frequency: z.string(),
        isVerified: z.boolean(),
      })
    )
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const pharmacistId = searchParams.get('pharmacistId');

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (pharmacistId) {
      where.pharmacistId = pharmacistId;
    }

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            medicine: true,
          },
        },
        pharmacist: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(
      { success: true, data: prescriptions },
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = reviewPrescriptionSchema.parse(body);

    // Update prescription
    const prescription = await prisma.prescription.update({
      where: { id: validated.prescriptionId },
      data: {
        status: validated.status,
        pharmacistId: validated.pharmacistId,
        pharmacistNotes: validated.notes,
        reviewedAt: new Date(),
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    // Update items if provided
    if (validated.items) {
      for (const item of validated.items) {
        await prisma.prescriptionItem.update({
          where: { id: item.itemId },
          data: {
            medicineId: item.medicineId,
            dosage: item.dosage,
            frequency: item.frequency,
            isVerified: item.isVerified,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: prescription,
        message: 'Prescription reviewed successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Review prescription error:', error);

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
        error: 'Failed to review prescription',
      },
      { status: 500 }
    );
  }
}
