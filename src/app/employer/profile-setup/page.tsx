'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyProfileForm from '@/components/forms/CompanyProfileForm';
import CompanyProfileView from '@/components/forms/CompanyProfileView';
import { Navbar, Footer } from '@/components/shared';
import toast from 'react-hot-toast';

export default function EmployerProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch employer profile
    fetchEmployerProfile(token);
  }, [router]);  const fetchEmployerProfile = async (token: string) => {
    try {
      const response = await fetch('/api/employer/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Set editing mode based on whether profile exists
        setIsEditing(!data.user.profile?.companyName);
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
      });      if (response.ok) {
        // Refresh the profile data
        await fetchEmployerProfile(token!);
        setIsEditing(false);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user.profile?.companyName) {
      setIsEditing(false);
    } else {
      router.push('/employer/dashboard');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {!user.profile?.companyName 
              ? 'Welcome to HiringBooth!' 
              : isEditing 
                ? 'Edit Company Profile' 
                : 'Company Profile'
            }
          </h1>
          <p className="text-gray-600 mt-2">
            {!user.profile?.companyName 
              ? 'Complete your company profile to start posting jobs'
              : isEditing 
                ? 'Update your company information below'
                : 'View and manage your company information'
            }
          </p>
          {!user.isApproved && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
              <p>Your account is pending approval. You'll be able to post jobs once approved by our admin team.</p>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <CompanyProfileForm
            initialData={user.profile}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isEditing={true}
            onCancel={handleCancel}
          />
        ) : (
          user.profile?.companyName && (
            <CompanyProfileView
              profile={user.profile}
              onEdit={handleEdit}
            />
          )        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
