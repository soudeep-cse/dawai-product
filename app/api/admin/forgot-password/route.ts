import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { generateResetToken } from '@/lib/auth';

const prisma = new PrismaClient();

const ForgotPasswordSchema = z.object({
  credential: z.string().min(1, 'Email, username, or phone required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { credential } = validation.data;

    // Find admin
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: credential },
          { username: credential },
          { phone: credential },
        ],
        isActive: true,
      },
    });

    if (!admin) {
      // Don't reveal if admin exists (security best practice)
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists, password reset instructions have been sent.',
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const { token, expiresAt } = generateResetToken();

    // Save token to database
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiresAt: expiresAt,
      },
    });

    // TODO: Send email with reset link
    // For now, return reset token in response (development only!)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset link:', resetLink);
      console.log('Token:', token);
    }

    // In production, send via email service
    // Example using Resend (email):
    // await resend.emails.send({
    //   from: 'noreply@dawai.com.bd',
    //   to: admin.email!,
    //   subject: 'Password Reset Request',
    //   html: `<a href="${resetLink}">Click here to reset your password</a>`,
    // });

    // Example using SMS:
    // await smsService.send({
    //   to: admin.phone!,
    //   message: `Your password reset code: ${token}. Valid for 1 hour.`,
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists, password reset instructions have been sent.',
        // Remove in production!
        ...(process.env.NODE_ENV === 'development' && { resetLink, token }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
