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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (role && ['USER', 'EMPLOYER'].includes(role)) {
      where.role = role;
    } else {
      // If no specific role, exclude admins
      where.role = { in: ['USER', 'EMPLOYER'] };
    }

    if (status === 'verified') {
      where.isVerified = true;
    } else if (status === 'pending') {
      where.isApproved = false;
      where.role = 'EMPLOYER';
    } else if (status === 'active') {
      where.isActive = true;
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          userProfile: true,
          companyProfile: true,
          jobsPosted: {
            select: {
              id: true,
              title: true,
              isActive: true
            }
          },
          applications: {
            select: {
              id: true,
              status: true,
              job: {
                select: {
                  title: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({ 
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Users list fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users list' }, { status: 500 });
  }
}
