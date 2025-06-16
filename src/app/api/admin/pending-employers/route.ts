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
    
    // Verify user is an admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const pendingEmployers = await prisma.user.findMany({
      where: {
        role: 'EMPLOYER',
        isApproved: false
      },      include: {
        companyProfile: true,
        jobsPosted: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ pendingEmployers });
  } catch (error) {
    console.error('Pending employers fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch pending employers' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { userId, action, reason } = await request.json();
    
    // Verify user is an admin
    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!userId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }    const updateData: any = {
      isApproved: action === 'approve'
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        companyProfile: true
      }
    });

    // Log the admin action (you could create an audit log table for this)
    console.log(`Admin ${admin.email} ${action}d employer ${updatedUser.email}${reason ? ` - Reason: ${reason}` : ''}`);

    return NextResponse.json({ 
      user: updatedUser,
      message: `Employer ${action}d successfully`
    });
  } catch (error) {
    console.error('Employer approval error:', error);
    return NextResponse.json({ error: 'Failed to update employer status' }, { status: 500 });
  }
}
