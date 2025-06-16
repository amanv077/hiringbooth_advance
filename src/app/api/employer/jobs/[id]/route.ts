import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { EmploymentType, ExperienceLevel } from '@prisma/client';

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
    }    const job = await prisma.job.findFirst({
      where: {
        id: params.id,
        employerId: decoded.userId,
      },
      include: {
        employer: true,
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
    }    const {
      title,
      description,
      requirements,
      salaryMin,
      salaryMax,
      location,
      type,
      experienceLevel,
      isActive,
    } = await request.json();

    // Map the form type to the schema employment type
    const employmentTypeMap: Record<string, EmploymentType> = {
      'FULL_TIME': EmploymentType.FULL_TIME,
      'PART_TIME': EmploymentType.PART_TIME,
      'CONTRACT': EmploymentType.CONTRACT,
      'FREELANCE': EmploymentType.FREELANCE,
      'INTERNSHIP': EmploymentType.INTERNSHIP
    };

    const experienceLevelMap: Record<string, ExperienceLevel> = {
      'ENTRY_LEVEL': ExperienceLevel.ENTRY_LEVEL,
      'MID_LEVEL': ExperienceLevel.MID_LEVEL,
      'SENIOR_LEVEL': ExperienceLevel.SENIOR_LEVEL,
      'EXECUTIVE': ExperienceLevel.EXECUTIVE
    };

    const job = await prisma.job.updateMany({
      where: {
        id: params.id,
        employerId: decoded.userId,
      },
      data: {
        title,
        description,
        requirements,
        salaryMin,
        salaryMax,
        location,
        employmentType: type ? employmentTypeMap[type] : undefined,
        experienceLevel: experienceLevel ? experienceLevelMap[experienceLevel] : undefined,
        isActive,
      },
    });

    if (job.count === 0) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    const updatedJob = await prisma.job.findUnique({
      where: { id: params.id },
      include: { employer: true },
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
    }    const deletedJob = await prisma.job.deleteMany({
      where: {
        id: params.id,
        employerId: decoded.userId,
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
