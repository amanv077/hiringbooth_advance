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

    const { searchParams } = new URL(request.url);
    const education = searchParams.get('education');
    const experience = searchParams.get('experience');
    const location = searchParams.get('location');
    const skills = searchParams.get('skills');

    // Build where clause for filtering
    const whereClause: any = {
      role: 'USER', // Only fetch users, not employers or admins
      userProfile: {
        isNot: null, // Only users with profiles
      },
    };

    // Apply filters if provided
    if (education || experience || location || skills) {
      const profileWhere: any = {};
      
      if (education) {
        profileWhere.education = {
          contains: education,
          mode: 'insensitive',
        };
      }
      
      if (experience) {
        profileWhere.experience = {
          contains: experience,
          mode: 'insensitive',
        };
      }
      
      if (location) {
        profileWhere.location = {
          contains: location,
          mode: 'insensitive',
        };
      }
      
      if (skills) {
        profileWhere.skills = {
          contains: skills,
          mode: 'insensitive',
        };
      }
      
      whereClause.userProfile = profileWhere;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        userProfile: true,
        applications: {
          include: {
            job: {
              select: {
                title: true,
                employmentType: true,
                createdAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('User data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
