'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiringLoader } from '@/components/ui/loader';
import { Navbar, Footer } from '@/components/shared';
import JobForm from '@/components/forms/JobForm';
import toast from 'react-hot-toast';

export default function CreateJob() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch employer profile to check approval status
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
        
        // If profile is not complete, redirect to profile setup
        if (!data.user.profile?.companyName) {
          router.push('/employer/profile-setup');
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
    const loadingToast = toast.loading('Creating job...');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },        body: JSON.stringify(formData),
      });      if (response.ok) {
        toast.success('Job created successfully!', {
          id: loadingToast,
          icon: '🎉',
        });
        router.push('/employer/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create job', {
          id: loadingToast,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job', {
        id: loadingToast,
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <HiringLoader size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Account Pending Approval</h2>
              <p>Your employer account is currently under review by our admin team. You'll be able to post jobs once your account is approved.</p>
              <button
                onClick={() => router.push('/employer/dashboard')}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => router.push('/employer/dashboard')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Post a New Job</h1>
            <p className="text-gray-600 mt-2">
              Fill out the details below to post your job listing
            </p>
          </div>
          
          <JobForm
            onSubmit={handleSubmit}
            submitLabel="Post Job"
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
