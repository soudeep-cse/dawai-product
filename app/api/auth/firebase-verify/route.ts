import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { verifyFirebaseToken } from '@/lib/firebaseAdmin';

const prisma = new PrismaClient();

const verifySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = verifySchema.parse(body);

    let decoded;
    try {
      decoded = await verifyFirebaseToken(idToken);
    } catch (err) {
      console.error('Firebase token verification failed:', err);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { uid, phone_number: phone, email } = decoded;

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, error: 'Token did not include a phone number or email' },
        { status: 400 }
      );
    }

    // Find-or-create by the stable Firebase uid, filling in whatever
    // contact info this particular sign-in method provided.
    let customer = await prisma.customer.findUnique({ where: { firebaseUid: uid } });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firebaseUid: uid,
          phone: phone || undefined,
          email: email || undefined,
          lastLoginAt: new Date(),
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          phone: phone || customer.phone,
          email: email || customer.email,
          lastLoginAt: new Date(),
        },
      });
    }

    const token = jwt.sign(
      {
        customerId: customer.id,
        phone: customer.phone,
        type: 'customer',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          customerId: customer.id,
          phone: customer.phone,
          name: customer.name,
          email: customer.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Firebase verify error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'An account with this phone or email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to verify login' },
      { status: 500 }
    );
  }
}
