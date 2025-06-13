'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  bio: string;
  skills: string;
  experience: string;
  education: string;
}

interface UserProfileFormProps {
  initialData?: Partial<UserProfileData>;
  onSubmit: (data: UserProfileData) => Promise<void>;
  isLoading?: boolean;
}

export default function UserProfileForm({ 
  initialData, 
  onSubmit, 
  isLoading = false 
}: UserProfileFormProps) {
  const [formData, setFormData] = useState<UserProfileData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phoneNumber: initialData?.phoneNumber || '',
    location: initialData?.location || '',
    bio: initialData?.bio || '',
    skills: initialData?.skills || '',
    experience: initialData?.experience || '',
    education: initialData?.education || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. New York, NY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <textarea
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="List your skills (e.g. JavaScript, React, Node.js, Project Management)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience</label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="Describe your work experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Education</label>
            <textarea
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Describe your educational background..."
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
