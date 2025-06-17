'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  FileText, 
  Briefcase, 
  GraduationCap,
  ExternalLink,
  Globe,
  Github,
  Linkedin
} from 'lucide-react';
import { getStatusColor, getStatusIcon, formatDate } from '@/lib/employerUtils';
import { stripHtmlTags } from '@/lib/htmlUtils';

interface ApplicationModalProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (applicationId: string, status: string) => void;
  isLoading: boolean;
}

export function ApplicationModal({ 
  application, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  isLoading 
}: ApplicationModalProps) {
  if (!isOpen || !application) return null;

  const applicant = application.applicant;
  const profile = applicant.userProfile;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Application Review</h2>
            <p className="text-sm text-gray-600">For position: {application.job.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Applicant Overview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {profile?.firstName && profile?.lastName 
                    ? `${profile.firstName} ${profile.lastName}` 
                    : applicant.email}
                </CardTitle>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                  <span className="mr-2">{getStatusIcon(application.status)}</span>
                  {application.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{applicant.email}</p>
                  </div>
                </div>

                {profile?.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-900">{profile.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-900">{profile.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Applied</p>
                    <p className="text-sm text-gray-900">{formatDate(application.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Links</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <Linkedin className="h-4 w-4 mr-1" />
                        LinkedIn
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        GitHub
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Portfolio
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Professional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bio */}
            {profile?.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{stripHtmlTags(profile.bio)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profile?.skills && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{stripHtmlTags(profile.skills)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {profile?.experience && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{stripHtmlTags(profile.experience)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {profile?.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{stripHtmlTags(profile.education)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resume */}
          {profile?.resumeUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button variant="outline" onClick={onClose} className="order-last sm:order-first">
              Close
            </Button>

            {application.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(application.id, 'REVIEWED')}
                  disabled={isLoading}
                >
                  Mark as Reviewed
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(application.id, 'REJECTED')}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  Reject
                </Button>
                
                <Button
                  onClick={() => onUpdateStatus(application.id, 'ACCEPTED')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept Application
                </Button>
              </>
            )}

            {application.status === 'VIEWED' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(application.id, 'REJECTED')}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  Reject
                </Button>
                
                <Button
                  onClick={() => onUpdateStatus(application.id, 'ACCEPTED')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept Application
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
