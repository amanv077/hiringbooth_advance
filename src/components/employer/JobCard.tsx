'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Eye, 
  Edit, 
  DollarSign,
  Clock,
  Building
} from 'lucide-react';
import { 
  formatDate, 
  formatSalary, 
  formatJobType, 
  formatExperienceLevel, 
  getJobStatusBadge,
  getApplicationStats 
} from '@/lib/employerUtils';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  urgency?: string;
  isActive: boolean;
  createdAt: string;
  applications?: any[];
  _count?: {
    applications: number;
  };
}

interface JobCardProps {
  job: Job;
  onViewApplications: (job: Job) => void;
  onEditJob: (job: Job) => void;
  onToggleStatus: (jobId: string, isActive: boolean) => void;
  isLoading: boolean;
}

export function JobCard({ 
  job, 
  onViewApplications, 
  onEditJob, 
  onToggleStatus, 
  isLoading 
}: JobCardProps) {
  const statusBadge = getJobStatusBadge(job.isActive, job.urgency);
  const applicationStats = getApplicationStats(job.applications || []);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                {statusBadge.text}
              </span>
            </div>
            
            {/* Job Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{formatJobType(job.employmentType)}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{formatExperienceLevel(job.experienceLevel)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>

            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center text-green-600 font-semibold mb-3">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </span>
              </div>
            )}

            {/* Application Stats */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                <Users className="h-3 w-3 mr-1" />
                {applicationStats.total} applications
              </span>
              {applicationStats.pending > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  {applicationStats.pending} pending
                </span>
              )}
              {applicationStats.accepted > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {applicationStats.accepted} hired
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewApplications(job)}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Applications ({applicationStats.total})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditJob(job)}
            className="flex-1 sm:flex-none"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Job
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(job.id, !job.isActive)}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {job.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
