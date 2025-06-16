"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ButtonLoader } from "@/components/ui/loader"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import toast from 'react-hot-toast'

function VerifyOtpForm() {  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode })
      });
      
      if (response.ok) {
        toast.success("Email verified successfully! You can now log in.", {
          icon: '✅',
        });
        window.location.href = "/auth/login"
      } else {
        const error = await response.json()
        toast.error(error.message || "Verification failed", {
          icon: '❌',
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        icon: '❌',
      });
    }finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    try {      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        toast.success("New OTP sent to your email!", {
          icon: '📧',
        });
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to resend OTP", {
          icon: '❌',
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        icon: '❌',
      });
    }finally {
      setIsResending(false)
    }  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            HiringBooth
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 text-primary mr-2" />
              Email Verification
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <Input
                  id="otpCode"
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="mt-1 text-center text-lg font-mono tracking-widest"
                />
              </div>              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otpCode.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <ButtonLoader size="sm" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-medium text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  {isResending ? (
                    <>
                      <ButtonLoader size="sm" />
                      Sending...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </button>              </p>
            </div>

            <div className="mt-6">
              <Link                href="/auth/register"
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  )
}
