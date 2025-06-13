import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import jwt from "jsonwebtoken"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userProfile: true,
        companyProfile: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email address before logging in" },
        { status: 401 }
      )
    }

    // Check if employer is approved (for employers only)
    if (user.role === "EMPLOYER" && !user.isApproved) {
      return NextResponse.json(
        { message: "Your employer account is pending admin approval" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }    )

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      token: token, // Add token to response for frontend storage
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
        hasProfile: user.role === "USER" ? !!user.userProfile : !!user.companyProfile
      },
      role: user.role.toLowerCase()
    })

    // Set cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error("Login error:", error)
    
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
