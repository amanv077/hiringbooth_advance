import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Verify user is an employer
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const applications = await prisma.application.findMany({
      where: {
        job: {
          companyId: decoded.userId,
        },
      },
      include: {
        user: {
          include: {
            userProfile: true,
          },
        },
        job: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
