import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otpCode: z.string().length(6, "OTP must be 6 digits")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otpCode } = verifyOtpSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Check if OTP is valid
    if (!user.otpCode || user.otpCode !== otpCode) {
      return NextResponse.json(
        { message: "Invalid OTP code" },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify user
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null
      }
    })

    return NextResponse.json({
      message: "Email verified successfully. You can now log in."
    })

  } catch (error) {
    console.error("OTP verification error:", error)
    
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
