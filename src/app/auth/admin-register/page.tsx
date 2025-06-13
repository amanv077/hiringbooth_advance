"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Shield, AlertTriangle } from "lucide-react"

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      setIsLoading(false)
      return
    }

    // Simple admin code verification (in production, use environment variable)
    if (formData.adminCode !== "HIRINGBOOTH_ADMIN_2025") {
      alert("Invalid admin code!")
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
          password: formData.password,
          role: "admin"
        })
      })

      if (response.ok) {
        alert("Admin registration successful! Please check your email for OTP verification.")
        // Redirect to OTP verification or login
        window.location.href = "/auth/login"
      } else {
        const error = await response.json()
        alert(error.message || "Registration failed")
      }
    } catch (error) {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
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
            Admin Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register as a system administrator
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Admin Registration
            </CardTitle>
            <CardDescription>
              This page is for authorized administrators only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  Admin code required for registration
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="mt-1"
                  placeholder="Enter your full name"
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
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">
                  Admin Code
                </label>
                <Input
                  id="adminCode"
                  type="password"
                  required
                  value={formData.adminCode}
                  onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                  className="mt-1"
                  placeholder="Enter admin authorization code"
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
                  className="mt-1"
                  placeholder="Enter your password"
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
                  className="mt-1"
                  placeholder="Confirm your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Admin Account..." : "Register as Admin"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-primary hover:text-primary/80">
                Already have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
