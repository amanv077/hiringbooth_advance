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

    const jobs = await prisma.job.findMany({
      where: { companyId: decoded.userId },
      include: {
        company: true,
        applications: {
          include: {
            user: {
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
    });

    if (!user || user.role !== 'EMPLOYER' || !user.isApproved) {
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
      category,
      experienceLevel,
    } = await request.json();

    const job = await prisma.job.create({
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
        companyId: decoded.userId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
