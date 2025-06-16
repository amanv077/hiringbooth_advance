import { NextRequest, NextResponse } from 'next/server';
import { testEmailConnection, sendOTPEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const result = await testEmailConnection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json({ 
        error: 'Email and name are required' 
      }, { status: 400 });
    }

    await sendOTPEmail(email, name, '123456', false);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
