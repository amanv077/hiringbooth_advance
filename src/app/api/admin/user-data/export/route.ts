import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import * as XLSX from 'xlsx';

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

    // Build where clause for filtering (same as user-data route)
    const whereClause: any = {
      role: 'USER',
      userProfile: {
        isNot: null,
      },
    };

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
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data for Excel export
    const excelData = users.map(user => {
      const profile = user.userProfile;
      let skills: string[] = [];
      
      try {
        skills = profile?.skills ? JSON.parse(profile.skills) : [];
      } catch {
        skills = [];
      }

      return {
        'User ID': user.id,
        'Name': user.name,
        'Email': user.email,
        'Phone': profile?.phone || '',
        'Location': profile?.location || '',
        'Bio': profile?.bio || '',
        'Education': profile?.education || '',
        'Experience': profile?.experience || '',
        'Skills': skills.join(', '),
        'LinkedIn': profile?.linkedinUrl || '',
        'GitHub': profile?.githubUrl || '',
        'Portfolio': profile?.portfolioUrl || '',
        'Applications Count': user._count.applications,
        'Verified': user.isVerified ? 'Yes' : 'No',
        'Registration Date': user.createdAt.toLocaleDateString(),
        'Last Updated': user.updatedAt.toLocaleDateString(),
      };
    });

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const columnWidths = [
      { wch: 15 }, // User ID
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 20 }, // Location
      { wch: 30 }, // Bio
      { wch: 25 }, // Education
      { wch: 15 }, // Experience
      { wch: 40 }, // Skills
      { wch: 25 }, // LinkedIn
      { wch: 25 }, // GitHub
      { wch: 25 }, // Portfolio
      { wch: 15 }, // Applications Count
      { wch: 10 }, // Verified
      { wch: 15 }, // Registration Date
      { wch: 15 }, // Last Updated
    ];
    
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `user-data-export-${timestamp}.xlsx`;
    
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
