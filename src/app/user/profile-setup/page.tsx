'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserProfileForm from '@/components/forms/UserProfileForm';
import { Navbar, Footer } from '@/components/shared';
import toast from 'react-hot-toast';

export default function UserProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch user profile
    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // If profile is already complete, redirect to dashboard
        if (data.user.profile?.firstName) {
          router.push('/user/dashboard');
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
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });      if (response.ok) {
        router.push('/user/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save profile', {
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile', {
        icon: '❌',
      });
    }finally {
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to HiringBooth!</h1>
            <p className="text-gray-600 mt-2">
              Let's set up your profile to help employers find you
            </p>
          </div>
          <UserProfileForm
          initialData={user.profile}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />        </div>
      </div>
      <Footer />
    </div>
  );
}
