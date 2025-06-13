"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ButtonLoader } from "@/components/ui/loader"

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: 'admin@hiringbooth.com',
    password: 'admin123456'
  })

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const testAdminLogin = async () => {
    setIsLoading(true)
    addResult("Testing admin login...")
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Login successful - Role: ${data.user.role}`)
        addResult(`Token received: ${data.token ? 'Yes' : 'No'}`)
        
        if (data.token) {
          localStorage.setItem('authToken', data.token)
          addResult("Token stored in localStorage")
        }
        
        addResult(`Should redirect to: /admin/dashboard`)
      } else {
        addResult(`❌ Login failed: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`)
    }
    
    setIsLoading(false)
  }

  const testRegistration = async () => {
    setIsLoading(true)
    const testEmail = `test-${Date.now()}@example.com`
    addResult(`Testing registration with: ${testEmail}`)
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: testEmail,
          password: "password123",
          role: "user"
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Registration successful - UserID: ${data.userId}`)
        
        // Test email verification bypass
        const verifyResponse = await fetch("/api/auth/dev-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: testEmail })
        })
        
        const verifyData = await verifyResponse.json()
        if (verifyResponse.ok) {
          addResult(`✅ Email verification bypassed successfully`)
          
          // Test login with new user
          const loginResponse = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: testEmail,
              password: "password123"
            })
          })
          
          const loginData = await loginResponse.json()
          if (loginResponse.ok) {
            addResult(`✅ New user login successful - Role: ${loginData.user.role}`)
          } else {
            addResult(`❌ New user login failed: ${loginData.message}`)
          }
        } else {
          addResult(`❌ Email verification failed: ${verifyData.error}`)
        }
      } else {
        addResult(`❌ Registration failed: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Registration error: ${error}`)
    }
    
    setIsLoading(false)
  }

  const checkAuthState = () => {
    const token = localStorage.getItem('authToken')
    addResult(`Current auth token: ${token ? 'Present' : 'None'}`)
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        addResult(`Token payload: ${JSON.stringify(payload, null, 2)}`)
      } catch (error) {
        addResult(`❌ Invalid token format`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Testing Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>
                Run authentication tests and check system status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Email</label>
                <Input
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Test Password</label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Password"
                />
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={testAdminLogin} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? <ButtonLoader size="sm" /> : "Test Admin Login"}
                </Button>
                
                <Button 
                  onClick={testRegistration} 
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  {isLoading ? <ButtonLoader size="sm" /> : "Test Full Registration Flow"}
                </Button>
                
                <Button 
                  onClick={checkAuthState}
                  variant="outline"
                  className="w-full"
                >
                  Check Auth State
                </Button>
                
                <Button 
                  onClick={clearResults}
                  variant="destructive"
                  className="w-full"
                >
                  Clear Results
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Real-time test output and debugging information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm">
                {testResults.length === 0 ? (
                  <div className="text-gray-500">No tests run yet. Click a test button to start.</div>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="mb-1">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <a href="/auth/login">Login Page</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/register">Register Page</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/dashboard">Admin Dashboard</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/admin-register">Admin Register</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
