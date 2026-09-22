import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import {
  verifyPassword,
  createToken,
  isAccountLocked,
  getNextLockoutTime,
} from '@/lib/auth';

const prisma = new PrismaClient();

// Input validation
const LoginSchema = z.object({
  credential: z.string().min(1, 'Email, username, or phone required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { credential, password } = validation.data;

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
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (isAccountLocked(admin.lockedUntil)) {
      const minutesLeft = Math.ceil(
        (admin.lockedUntil!.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          success: false,
          error: `Account locked. Try again in ${minutesLeft} minutes.`,
        },
        { status: 403 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account is disabled',
        },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, admin.passwordHash);

    if (!passwordValid) {
      // Increment failed attempts
      const newFailedAttempts = admin.failedLoginAttempts + 1;
      let lockedUntil = null;

      // Lock account after 5 failed attempts
      if (newFailedAttempts >= 5) {
        lockedUntil = getNextLockoutTime(newFailedAttempts);
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockedUntil,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          attemptsRemaining: Math.max(0, 5 - newFailedAttempts),
        },
        { status: 401 }
      );
    }

    // Password correct - reset failed attempts and update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Create JWT token
    const token = await createToken({
      id: admin.id,
      email: admin.email || undefined,
      username: admin.username || undefined,
      role: admin.role as any,
    });

    // Return token in httpOnly cookie + response body
    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          username: admin.username,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // Set secure httpOnly cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
