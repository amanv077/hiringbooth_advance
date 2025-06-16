import nodemailer from 'nodemailer';

export const createEmailTransporter = () => {
  // Check if we have email configuration
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration missing. Required: EMAIL_HOST, EMAIL_USER, EMAIL_PASS');
    console.warn('Current config:', {
      host: process.env.EMAIL_HOST ? 'SET' : 'MISSING',
      user: process.env.EMAIL_USER ? 'SET' : 'MISSING',
      pass: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
    });
    return null;
  }

  const config: any = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  // Gmail-specific configuration
  if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
    config.service = 'gmail';
    config.secure = false;
    config.requireTLS = true;
  }
  try {
    return nodemailer.createTransport(config);
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

export const sendOTPEmail = async (to: string, name: string, otpCode: string, isResend = false) => {
  const transporter = createEmailTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter not available');
  }

  const subject = isResend ? "HiringBooth - New OTP Verification Code" : "Verify your HiringBooth account";
  const greeting = isResend ? "You requested a new OTP for your HiringBooth account" : "Thank you for registering with HiringBooth";

  const mailOptions = {
    from: `"HiringBooth" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">HiringBooth</h1>
          <p style="color: #6b7280; margin: 5px 0;">Your Career Platform</p>
        </div>
        
        <h2 style="color: #1f2937;">Email Verification</h2>
        <p>Hi ${name},</p>
        <p>${greeting}. Please use the following OTP to verify your email address:</p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; border-radius: 12px; margin: 25px 0;">
          <p style="color: white; margin: 0 0 10px 0; font-size: 16px;">Your verification code is:</p>
          <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 3px; font-weight: bold;">${otpCode}</h1>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>⏰ Important:</strong> This OTP will expire in 10 minutes.</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't ${isResend ? 'request this OTP' : 'create an account'} with HiringBooth, please ignore this email.
        </p>
        
        <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 30px 0;">
        
        <div style="text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2025 HiringBooth. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
};

export const testEmailConnection = async () => {
  const transporter = createEmailTransporter();
  
  if (!transporter) {
    return { success: false, error: 'Email transporter not available' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
