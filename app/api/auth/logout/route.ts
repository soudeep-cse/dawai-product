import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    response.headers.set(
      'Set-Cookie',
      serialize('customer-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
