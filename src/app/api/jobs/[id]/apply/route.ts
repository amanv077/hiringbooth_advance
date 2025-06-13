import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { coverLetter } = await request.json();
    
    // Verify user exists and is a job seeker
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'USER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or inactive' }, { status: 404 });
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: decoded.userId,
        jobId: params.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId: decoded.userId,
        jobId: params.id,
        coverLetter,
        status: 'PENDING',
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        user: {
          include: {
            userProfile: true,
          },
        },
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Application creation error:', error);
    return NextResponse.json({ error: 'Failed to apply to job' }, { status: 500 });
  }
}
