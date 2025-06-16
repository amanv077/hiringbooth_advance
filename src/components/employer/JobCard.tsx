'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Clock4, BarChart, Users, DollarSign, Edit, Eye, Calendar } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  category: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onToggleStatus: (jobId: string, newStatus: boolean) => void;
  onViewApplications: (jobId: string) => void;
  isLoading?: boolean;
}

export function JobCard({ job, onEdit, onToggleStatus, onViewApplications, isLoading }: JobCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min || !max) return null;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatText = (text: string) => {
    return text?.replace('_', ' ') || 'Not specified';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => onEdit(job)}
          >
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors group-hover:text-blue-600">
                {job.title}
              </h3>
              <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                job.isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
              }`}>
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {job.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <Clock4 className="h-3 w-3" />
                {formatText(job.type)}
              </span>
              <span className="flex items-center gap-1">
                <BarChart className="h-3 w-3" />
                {formatText(job.experienceLevel)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {job._count?.applications || 0} applications
              </span>
            </div>
            
            {job.salaryMin && job.salaryMax && (
              <div className="mt-2">
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </div>
            )}

            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Posted on {formatDate(job.createdAt)}
            </div>
          </div>
          
          <div className="ml-6 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(job.id, !job.isActive);
              }}
              disabled={isLoading}
            >
              {job.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewApplications(job.id);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              Applications ({job._count?.applications || 0})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
