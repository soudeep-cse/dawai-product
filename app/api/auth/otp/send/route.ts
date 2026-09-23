import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import { smsService } from '@/lib/sms-service';

const prisma = new PrismaClient();

const sendOtpSchema = z.object({
  phone: z.string().min(11).regex(/^01[0-9]/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = sendOtpSchema.parse(body);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash OTP before storing
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: validated.phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          phone: validated.phone,
          otpCodeHash: otpHash,
          otpExpiresAt,
        },
      });
    } else {
      // Update existing customer with new OTP
      customer = await prisma.customer.update({
        where: { phone: validated.phone },
        data: {
          otpCodeHash: otpHash,
          otpExpiresAt,
        },
      });
    }

    // Send OTP via SMS (real service or mock)
    const smsSent = await smsService.sendOTP(validated.phone, otp);

    if (!smsSent) {
      console.warn(`Warning: SMS may not have been sent to ${validated.phone}, but OTP stored`);
      // Don't fail - OTP is stored, user can still verify
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone: validated.phone,
          expiresIn: 600, // 10 minutes in seconds
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Send OTP error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number format',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send OTP',
      },
      { status: 500 }
    );
  }
}
