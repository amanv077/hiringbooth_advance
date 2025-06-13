'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyProfileForm from '@/components/forms/CompanyProfileForm';

export default function EmployerProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch employer profile
    fetchEmployerProfile(token);
  }, [router]);

  const fetchEmployerProfile = async (token: string) => {
    try {
      const response = await fetch('/api/employer/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // If profile is already complete, redirect to dashboard
        if (data.user.profile?.companyName) {
          router.push('/employer/dashboard');
        }
      } else {
        localStorage.removeItem('authToken');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/employer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/employer/dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to HiringBooth!</h1>
          <p className="text-gray-600 mt-2">
            Complete your company profile to start posting jobs
          </p>
          {!user.isApproved && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
              <p>Your account is pending approval. You'll be able to post jobs once approved by our admin team.</p>
            </div>
          )}
        </div>
        
        <CompanyProfileForm
          initialData={user.profile}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
