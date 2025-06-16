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

    // Get all counts in parallel for better performance
    const [
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalJobs,
      activeJobs,
      pendingApprovals,
      totalApplications,
      verifiedUsers
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: {
            in: ['USER', 'EMPLOYER']
          }
        }
      }),
      prisma.user.count({
        where: { role: 'USER' }
      }),
      prisma.user.count({
        where: { role: 'EMPLOYER' }
      }),
      prisma.job.count(),
      prisma.job.count({
        where: { isActive: true }
      }),
      prisma.user.count({
        where: {
          role: 'EMPLOYER',
          isApproved: false
        }
      }),
      prisma.application.count(),
      prisma.user.count({
        where: { isVerified: true }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        totalJobs,
        activeJobs,
        pendingApprovals,
        totalApplications,
        verifiedUsers
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
