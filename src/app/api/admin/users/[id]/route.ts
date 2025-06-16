import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { isApproved } = await request.json();
    
    // Verify user is an admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isApproved,
      },
      include: {
        userProfile: true,
        companyProfile: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
