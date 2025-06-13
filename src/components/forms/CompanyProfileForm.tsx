'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyProfileData {
  companyName: string;
  companyDescription: string;
  industry: string;
  companySize: string;
  website: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
}

interface CompanyProfileFormProps {
  initialData?: Partial<CompanyProfileData>;
  onSubmit: (data: CompanyProfileData) => Promise<void>;
  isLoading?: boolean;
}

export default function CompanyProfileForm({ 
  initialData, 
  onSubmit, 
  isLoading = false 
}: CompanyProfileFormProps) {
  const [formData, setFormData] = useState<CompanyProfileData>({
    companyName: initialData?.companyName || '',
    companyDescription: initialData?.companyDescription || '',
    industry: initialData?.industry || '',
    companySize: initialData?.companySize || '1-10',
    website: initialData?.website || '',
    location: initialData?.location || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CompanyProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name *</label>
              <Input
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry *</label>
              <Input
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g. Technology, Healthcare, Finance"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company Size *</label>
              <select
                value={formData.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourcompany.com"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. New York, NY"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <Input
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="contact@company.com"
                type="email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="Company phone number"
                type="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Description *</label>
            <textarea
              value={formData.companyDescription}
              onChange={(e) => handleChange('companyDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="Describe your company, mission, and culture..."
              required
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
