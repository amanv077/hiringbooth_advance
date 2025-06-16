import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { EmploymentType, ExperienceLevel } from '@prisma/client';

type UrgencyType = 'URGENT' | 'NOT_URGENT';

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
    });    if (!user || user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const jobs = await prisma.job.findMany({
      where: { employerId: decoded.userId },      include: {
        employer: true,
        applications: {
          include: {
            applicant: {
              include: {
                userProfile: true,
              },
            },
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Verify user is an employer and approved
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });    if (!user || user.role !== 'EMPLOYER' || !user.isApproved) {
      return NextResponse.json({ error: 'Unauthorized or not approved' }, { status: 403 });
    }
    
    const {
      title,
      description,
      requirements,
      salaryMin,
      salaryMax,
      location,
      type,
      experienceLevel,
      urgency,
    } = await request.json();

    // Map the form type to the schema employment type
    const employmentTypeMap: Record<string, EmploymentType> = {
      'FULL_TIME': EmploymentType.FULL_TIME,
      'PART_TIME': EmploymentType.PART_TIME,
      'CONTRACT': EmploymentType.CONTRACT,      'FREELANCE': EmploymentType.FREELANCE,
      'INTERNSHIP': EmploymentType.INTERNSHIP
    };
    
    const experienceLevelMap: Record<string, ExperienceLevel> = {
      'ENTRY_LEVEL': ExperienceLevel.ENTRY_LEVEL,
      'MID_LEVEL': ExperienceLevel.MID_LEVEL,
      'SENIOR_LEVEL': ExperienceLevel.SENIOR_LEVEL,
      'EXECUTIVE': ExperienceLevel.EXECUTIVE
    };
    
    const urgencyMap: Record<string, UrgencyType> = {
      'URGENT': 'URGENT',
      'NOT_URGENT': 'NOT_URGENT'
    };    const job = await prisma.job.create({      data: {
        title,
        description,
        requirements,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        location,
        employmentType: employmentTypeMap[type] || EmploymentType.FULL_TIME,
        experienceLevel: experienceLevelMap[experienceLevel] || ExperienceLevel.ENTRY_LEVEL,
        employerId: decoded.userId,
      },
      include: {
        employer: true,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
