'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  type: string;
  category: string;
  experienceLevel: string;
}

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function JobForm({ 
  initialData, 
  onSubmit, 
  submitLabel = 'Create Job',
  isLoading = false 
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    salaryMin: initialData?.salaryMin || 0,
    salaryMax: initialData?.salaryMax || 0,
    location: initialData?.location || '',
    type: initialData?.type || 'FULL_TIME',
    category: initialData?.category || '',
    experienceLevel: initialData?.experienceLevel || 'ENTRY_LEVEL',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof JobFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. New York, NY or Remote"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience Level *</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => handleChange('experienceLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR_LEVEL">Senior Level</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Input
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g. Technology, Marketing, Sales"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary Range</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleChange('salaryMin', parseInt(e.target.value) || 0)}
                  placeholder="Min"
                  min="0"
                />
                <span className="flex items-center">-</span>
                <Input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleChange('salaryMax', parseInt(e.target.value) || 0)}
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Requirements *</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="List the required skills, experience, and qualifications..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
