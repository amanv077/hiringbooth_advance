import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const job = await prisma.job.findFirst({
      where: {
        id: params.id,
        companyId: decoded.userId,
      },
      include: {
        company: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Job fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const {
      title,
      description,
      requirements,
      salaryMin,
      salaryMax,
      location,
      type,
      category,
      experienceLevel,
      isActive,
    } = await request.json();

    const job = await prisma.job.updateMany({
      where: {
        id: params.id,
        companyId: decoded.userId,
      },
      data: {
        title,
        description,
        requirements,
        salaryMin,
        salaryMax,
        location,
        type,
        category,
        experienceLevel,
        isActive,
      },
    });

    if (job.count === 0) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    const updatedJob = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const deletedJob = await prisma.job.deleteMany({
      where: {
        id: params.id,
        companyId: decoded.userId,
      },
    });

    if (deletedJob.count === 0) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Job deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
