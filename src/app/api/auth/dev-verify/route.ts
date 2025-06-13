import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
    }

    // In development mode, allow bypass for testing
    if (process.env.NODE_ENV === 'development') {
      // Verify the user without OTP check
      await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          otpCode: null,
          otpExpiry: null
        }
      });

      return NextResponse.json({
        message: 'Email verified successfully (development bypass)',
        verified: true
      });
    }

    return NextResponse.json({ 
      error: 'Email configuration required for OTP verification' 
    }, { status: 400 });

  } catch (error) {
    console.error('Dev verify error:', error);
    return NextResponse.json({ 
      error: 'Failed to verify email' 
    }, { status: 500 });
  }
}
