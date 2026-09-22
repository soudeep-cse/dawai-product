import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  credential: z.string().min(1, 'Email, username, or phone required'),
  password: z.string().min(1, 'Password required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, password } = loginSchema.parse(body);

    // Find admin by email, username, or phone
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: credential },
          { username: credential },
          { phone: credential },
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Create response with HttpOnly cookie
    const response = NextResponse.json(
      { success: true, admin: { id: admin.id, email: admin.email, name: admin.name } },
      { status: 200 }
    );

    response.cookies.set(
      'admin-token',
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      }
    );

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
