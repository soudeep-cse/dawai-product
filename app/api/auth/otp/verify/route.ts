import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const verifyOtpSchema = z.object({
  phone: z.string().min(11).regex(/^01[0-9]/),
  otp: z.string().length(6).regex(/^[0-9]{6}$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = verifyOtpSchema.parse(body);

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { phone: validated.phone },
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer not found. Please request OTP first.',
        },
        { status: 404 }
      );
    }

    // Check OTP expiry
    if (!customer.otpExpiresAt || new Date() > customer.otpExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'OTP expired. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Verify OTP hash
    const otpHash = crypto.createHash('sha256').update(validated.otp).digest('hex');
    if (customer.otpCodeHash !== otpHash) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid OTP. Please try again.',
        },
        { status: 400 }
      );
    }

    // Clear OTP
    const updatedCustomer = await prisma.customer.update({
      where: { phone: validated.phone },
      data: {
        otpCodeHash: null,
        otpExpiresAt: null,
        lastLoginAt: new Date(),
      },
    });

    // Create JWT token
    const token = jwt.sign(
      {
        customerId: updatedCustomer.id,
        phone: updatedCustomer.phone,
        type: 'customer',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Set HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          customerId: updatedCustomer.id,
          phone: updatedCustomer.phone,
          name: updatedCustomer.name,
        },
      },
      { status: 200 }
    );

    response.cookies.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Verify OTP error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify OTP',
      },
      { status: 500 }
    );
  }
}
