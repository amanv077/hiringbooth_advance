'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Globe, MapPin, Users, Edit } from 'lucide-react';
import Image from 'next/image';

interface CompanyProfileData {
  companyName: string;
  description: string;
  industry: string;
  companySize: string;
  website: string;
  location: string;
  logoUrl?: string;
}

interface CompanyProfileViewProps {
  profile: CompanyProfileData;
  onEdit: () => void;
}

export default function CompanyProfileView({ profile, onEdit }: CompanyProfileViewProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            Company Profile
          </CardTitle>
          <Button onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Logo and Basic Info */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            {profile.logoUrl ? (
              <div className="w-32 h-32 relative">
                <Image
                  src={profile.logoUrl}
                  alt={`${profile.companyName} logo`}
                  fill
                  className="object-contain rounded-lg border"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                <Building className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.companyName}</h2>
              <p className="text-gray-600">{profile.industry}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{profile.companySize} employees</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
              
              {profile.website && (
                <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About the Company</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {profile.description ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: profile.description }}
              />
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
