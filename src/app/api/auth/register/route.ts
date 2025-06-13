import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto"
import nodemailer from "nodemailer"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().refine((val) => {
    const normalized = val.toUpperCase();
    return ['USER', 'EMPLOYER', 'ADMIN'].includes(normalized);
  }, {
    message: "Role must be one of: user, employer, admin"
  }).transform((val) => val.toUpperCase() as 'USER' | 'EMPLOYER' | 'ADMIN').default("USER")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate OTP
    const otpCode = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // role is already normalized to uppercase by the schema transform
        otpCode,
        otpExpiry,
        isApproved: role === "USER" // Auto-approve job seekers, employers need admin approval
      }
    })    // Send OTP email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your HiringBooth account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to HiringBooth!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering with HiringBooth. Please use the following OTP to verify your email address:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 32px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't create an account with HiringBooth, please ignore this email.</p>
            <p>Best regards,<br>The HiringBooth Team</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
      // Continue anyway - user can request new OTP
    }

    return NextResponse.json({
      message: "Registration successful. Please check your email for OTP verification.",
      userId: user.id
    })

  } catch (error) {
    console.error("Registration error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
