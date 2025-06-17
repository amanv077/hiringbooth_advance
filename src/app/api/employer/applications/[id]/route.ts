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
    }    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { status } = requestBody;
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }    // Valid status values based on Prisma schema
    const validStatuses = ['PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED'];
    let finalStatus = status;
    
    // Handle "REVIEWED" as alias for "VIEWED"
    if (status === 'REVIEWED') {
      finalStatus = 'VIEWED';
    }
    
    if (!validStatuses.includes(finalStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    // Verify user is an employer
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }    // Verify the application belongs to employer's job
    const application = await prisma.application.findFirst({
      where: {
        id,
        job: {
          employerId: decoded.userId,
        },
      },
      include: {
        job: true,
        applicant: {
          include: {
            userProfile: true,
          },
        },
      },
    });    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { 
        status: finalStatus,
        reviewedAt: new Date(),
      },
      include: {
        applicant: {
          include: {
            userProfile: true,
          },
        },
        job: true,
      },
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Fetch the application that belongs to employer's job
    const application = await prisma.application.findFirst({
      where: {
        id,
        job: {
          employerId: decoded.userId,
        },
      },
      include: {
        job: true,
        applicant: {
          include: {
            userProfile: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Application fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}
