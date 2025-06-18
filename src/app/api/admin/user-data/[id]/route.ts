import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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
    
    // Verify user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { 
        id,
        role: 'USER', // Ensure we only fetch regular users
      },
      include: {
        userProfile: true,
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                employmentType: true,
                location: true,
                createdAt: true,
                employer: {
                  select: {
                    name: true,
                    companyProfile: {
                      select: {
                        companyName: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('User detail fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}

export async function PUT(
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
    
    // Verify user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { user: userData, profile: profileData } = body;

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        email: userData.email,
        isVerified: userData.isVerified,
      },
    });    // Update user profile if provided
    if (profileData) {
      await prisma.userProfile.upsert({
        where: { userId: id },
        update: profileData,
        create: {
          userId: id,
          ...profileData,
        },
      });
    }

    // Fetch updated user data
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userProfile: true,
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                employmentType: true,
                location: true,
                createdAt: true,
                employer: {
                  select: {
                    name: true,
                    companyProfile: {
                      select: {
                        companyName: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
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
    
    // Verify user is an admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user exists and is a regular user
    const user = await prisma.user.findUnique({
      where: { 
        id,
        role: 'USER', // Only allow deletion of regular users
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
