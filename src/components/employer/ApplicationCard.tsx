'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  ExternalLink,
  Phone,
  Eye
} from 'lucide-react';
import { getStatusColor, getStatusIcon, formatDate } from '@/lib/employerUtils';
import { stripHtmlTags } from '@/lib/htmlUtils';

interface ApplicationCardProps {
  application: any;
  onViewDetails: (application: any) => void;
  onUpdateStatus: (applicationId: string, status: string) => void;
  isLoading: boolean;
}

export function ApplicationCard({ 
  application, 
  onViewDetails, 
  onUpdateStatus, 
  isLoading 
}: ApplicationCardProps) {
  const applicant = application.applicant;
  const profile = applicant.userProfile;

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {profile?.firstName && profile?.lastName 
                  ? `${profile.firstName} ${profile.lastName}` 
                  : applicant.email}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                <span className="mr-1">{getStatusIcon(application.status)}</span>
                {application.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{applicant.email}</span>
              </div>
              
              {profile?.phoneNumber && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{profile.phoneNumber}</span>
                </div>
              )}
              
              {profile?.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Applied {formatDate(application.createdAt)}</span>
              </div>
            </div>

            {/* Skills Preview */}
            {profile?.skills && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {stripHtmlTags(profile.skills)}
                </p>
              </div>
            )}

            {/* Cover Letter Preview */}
            {application.coverLetter && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {application.coverLetter}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(application)}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>

          {application.status === 'PENDING' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(application.id, 'REVIEWED')}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                Mark as Reviewed
              </Button>
              
              <Button
                size="sm"
                onClick={() => onUpdateStatus(application.id, 'ACCEPTED')}
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
              >
                Accept
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(application.id, 'REJECTED')}
                disabled={isLoading}
                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                Reject
              </Button>
            </>
          )}

          {application.status === 'VIEWED' && (
            <>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(application.id, 'ACCEPTED')}
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
              >
                Accept
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(application.id, 'REJECTED')}
                disabled={isLoading}
                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                Reject
              </Button>
            </>
          )}

          {(application.status === 'ACCEPTED' || application.status === 'REJECTED') && (
            <div className="text-sm text-gray-500 py-2">
              Decision made on {application.reviewedAt ? formatDate(application.reviewedAt) : 'N/A'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
