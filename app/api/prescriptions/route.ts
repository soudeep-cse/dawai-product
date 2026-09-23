import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { analyzePrescriptionImage } from '@/lib/aiAnalyzer';

const prisma = new PrismaClient();

const uploadPrescriptionSchema = z.object({
  customerPhone: z.string().min(11),
  imageBase64: z.string(),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = uploadPrescriptionSchema.parse(body);

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: validated.customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { phone: validated.customerPhone },
      });
    }

    // Create prescription record (initially with PENDING_AI status)
    const prescription = await prisma.prescription.create({
      data: {
        customerId: customer.id,
        imageUrl: `prescription-${Date.now()}`, // Placeholder - would be actual S3 URL in prod
        status: 'PENDING_AI',
      },
    });

    // Run AI analysis asynchronously
    analyzeAndUpdatePrescription(prescription.id, validated.imageBase64, validated.mediaType as any).catch(
      (err) => console.error('Async prescription analysis failed:', err)
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          id: prescription.id,
          status: prescription.status,
          customerId: prescription.customerId,
          createdAt: prescription.createdAt,
        },
        message: 'Prescription uploaded. AI analysis in progress...',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload prescription error:', error);

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
        error: 'Failed to upload prescription',
      },
      { status: 500 }
    );
  }
}

// GET - Get prescriptions by customer phone or ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerPhone = searchParams.get('customerPhone');
    const prescriptionId = searchParams.get('prescriptionId');

    if (prescriptionId) {
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
        },
      });

      if (!prescription) {
        return NextResponse.json(
          { success: false, error: 'Prescription not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: prescription },
        { status: 200 }
      );
    }

    if (customerPhone) {
      const prescriptions = await prisma.prescription.findMany({
        where: {
          customer: { phone: customerPhone },
        },
        include: {
          items: {
            include: {
              medicine: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      return NextResponse.json(
        { success: true, data: prescriptions },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Please provide customerPhone or prescriptionId',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get prescription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prescription' },
      { status: 500 }
    );
  }
}

async function analyzeAndUpdatePrescription(
  prescriptionId: string,
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
) {
  try {
    const analysisResult = await analyzePrescriptionImage(imageBase64, mediaType);

    // Get all medicines to match extracted ones
    const availableMedicines = await prisma.medicine.findMany({
      select: {
        id: true,
        nameBn: true,
        nameEn: true,
        strength: true,
        dosageForm: true,
      },
    });

    // Save analysis results
    await prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        aiExtractedData: analysisResult as any,
        status: 'PENDING_REVIEW',
      },
    });

    // Create prescription items from extracted medicines
    for (const medicine of analysisResult.medicines) {
      // Find matching medicine in database
      const normalizedName = medicine.medicineName.toLowerCase();
      const matchedMedicine = availableMedicines.find(
        (m) =>
          m.nameEn.toLowerCase().includes(normalizedName) ||
          m.nameBn.toLowerCase().includes(normalizedName)
      );

      await prisma.prescriptionItem.create({
        data: {
          prescriptionId,
          medicineId: matchedMedicine?.id,
          rawText: medicine.medicineName,
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          isVerified: matchedMedicine ? medicine.confidence > 0.8 : false,
        },
      });
    }

    console.log(`Prescription ${prescriptionId} analyzed successfully`);
  } catch (error) {
    console.error(
      `Failed to analyze prescription ${prescriptionId}:`,
      error
    );

    // Mark as rejected if analysis fails
    await prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        status: 'NEEDS_CLARIFICATION',
        aiExtractedData: {
          error: 'Failed to analyze prescription image',
          medicines: [],
        },
      },
    });
  }
}
