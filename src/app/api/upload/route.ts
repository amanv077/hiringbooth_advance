import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided in request');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    console.log('Verifying token...');
    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('Invalid token provided');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    console.log('Token verified successfully for user:', decoded.userId);    // Get the uploaded file
    console.log('Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    
    console.log('File info:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type, 
      folder 
    });
    
    if (!file) {
      console.error('No file provided in form data');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json({ 
        error: 'Invalid file type. Only images and documents (PDF, DOC, DOCX) are allowed' 
      }, { status: 400 });
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    console.log('Creating uploads directory:', uploadsDir);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Directory created successfully');
    } catch (dirError) {
      console.error('Error creating directory:', dirError);
      return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 });
    }    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, fileName);
    
    console.log('Generated file path:', filePath);

    // Convert file to buffer and save
    console.log('Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Writing file to disk...');
    try {
      await writeFile(filePath, buffer);
      console.log('File written successfully');
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }

    // Return the URL
    const fileUrl = `/uploads/${folder}/${fileName}`;
    console.log('Upload successful, returning URL:', fileUrl);

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
  } catch (error) {
    console.error('Upload error details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
    }

    // Delete from Cloudinary
    const { deleteFromCloudinary } = await import('@/lib/cloudinary');
    const result = await deleteFromCloudinary(publicId);

    return NextResponse.json({
      message: 'File deleted successfully',
      result
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete file' 
    }, { status: 500 });
  }
}
