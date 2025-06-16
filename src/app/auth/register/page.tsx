"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ButtonLoader } from "@/components/ui/loader"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Building, User, Shield } from "lucide-react"
import toast from "react-hot-toast"

function RegisterForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "user"
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: defaultRole
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
      if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", {
        icon: '🔐',
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,          role: formData.role
        })
      })

      if (response.ok) {
        toast.success("Registration successful! Check your email for verification.", {
          icon: '✅',
        })
        // Redirect to OTP verification page with email parameter
        window.location.href = `/auth/verify-otp?email=${encodeURIComponent(formData.email)}`;
      } else {
        const error = await response.json()
        toast.error(error.message || "Registration failed", {
          icon: '❌',
        })
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        icon: '❌',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "user": return <User className="h-5 w-5" />
      case "employer": return <Building className="h-5 w-5" />
      case "admin": return <Shield className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "user": return "Job Seeker"
      case "employer": return "Employer"
      case "admin": return "Admin"
      default: return "Job Seeker"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            HiringBooth
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Choose your role and create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "user", label: "Job Seeker", desc: "Looking for job opportunities" },
                    { value: "employer", label: "Employer", desc: "Hiring talented professionals" }
                  ].map((role) => (
                    <div
                      key={role.value}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                        formData.role === role.value
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, role: role.value })}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={() => setFormData({ ...formData, role: role.value })}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          {getRoleIcon(role.value)}
                          <div>
                            <div className="font-medium text-gray-900">{role.label}</div>
                            <div className="text-sm text-gray-500">{role.desc}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="mt-1"
                />
              </div>              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <ButtonLoader size="sm" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
