'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/ui/file-upload';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface UserProfileData {
  name: string;
  phone: string;
  location: string;
  bio: string;
  skills: string;
  experience: string;
  education: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
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
}: UserProfileFormProps) {  const [formData, setFormData] = useState<UserProfileData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    bio: initialData?.bio || '',
    skills: initialData?.skills || '',
    experience: initialData?.experience || '',
    education: initialData?.education || '',
    resumeUrl: initialData?.resumeUrl || '',
    portfolioUrl: initialData?.portfolioUrl || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    githubUrl: initialData?.githubUrl || '',
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
        <form onSubmit={handleSubmit} className="space-y-6">          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
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

            <div>
              <label className="block text-sm font-medium mb-2">Portfolio URL</label>
              <Input
                value={formData.portfolioUrl || ''}
                onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                placeholder="https://yourportfolio.com"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <Input
                value={formData.linkedinUrl || ''}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <Input
                value={formData.githubUrl || ''}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                placeholder="https://github.com/yourusername"
                type="url"
              />
            </div>
          </div><div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <RichTextEditor
              value={formData.bio}
              onChange={(value) => handleChange('bio', value)}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <RichTextEditor
              value={formData.skills}
              onChange={(value) => handleChange('skills', value)}
              placeholder="List your skills (e.g. JavaScript, React, Node.js, Project Management)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience</label>
            <RichTextEditor
              value={formData.experience}
              onChange={(value) => handleChange('experience', value)}
              placeholder="Describe your work experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Education</label>
            <RichTextEditor
              value={formData.education}
              onChange={(value) => handleChange('education', value)}
              placeholder="Describe your educational background..."
            />
          </div>

          <div>
            <FileUpload
              label="Resume"
              accept="document"
              currentFile={formData.resumeUrl}
              onUpload={(url, fileName) => handleChange('resumeUrl', url)}
              onRemove={() => handleChange('resumeUrl', '')}
              maxSize={10}
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
