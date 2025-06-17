import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import path from 'path';
import { access } from 'fs/promises';

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const hasJwtSecret = !!process.env.JWT_SECRET;
    const jwtSecretLength = process.env.JWT_SECRET?.length || 0;
    
    // Test token verification with a sample token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    let tokenTestResult = 'No token provided';
    
    if (token) {
      try {
        const decoded = verifyToken(token);
        tokenTestResult = decoded ? `Token valid for user: ${decoded.userId}` : 'Token invalid';
      } catch (error) {
        tokenTestResult = `Token error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    // Test file system access
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let fsAccessResult = 'Unknown';
    try {
      await access(uploadsDir);
      fsAccessResult = 'Directory accessible';
    } catch (error) {
      fsAccessResult = `Directory not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      message: 'Upload API test endpoint',
      environment: {
        hasJwtSecret,
        jwtSecretLength: hasJwtSecret ? jwtSecretLength : 0,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        cwd: process.cwd(),
        uploadsDir
      },
      tokenTest: tokenTestResult,
      fileSystemTest: fsAccessResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Test upload endpoint called');
    
    // Simple test without file processing
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Test upload endpoint working',
      user: decoded,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test upload POST error:', error);
    return NextResponse.json({ 
      error: 'Test upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
