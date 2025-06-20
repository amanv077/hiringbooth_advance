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
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.userProfile,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { name, phone, location, bio, skills, experience, education, resumeUrl, portfolioUrl, linkedinUrl, githubUrl } = await request.json();

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { name },
      });
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: decoded.userId },
      update: {
        phone,
        location,
        bio,
        skills,
        experience,
        education,
        resumeUrl,
        portfolioUrl,
        linkedinUrl,
        githubUrl,
      },
      create: {
        userId: decoded.userId,
        phone,
        location,
        bio,
        skills,
        experience,
        education,
        resumeUrl,
        portfolioUrl,
        linkedinUrl,
        githubUrl,
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
