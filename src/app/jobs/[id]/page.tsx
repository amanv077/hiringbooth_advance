'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HiringLoader } from '@/components/ui/loader';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Building, 
  Calendar,
  Users,
  Star,
  Zap,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location?: string;
  isRemote: boolean;
  employmentType: string;
  experienceLevel: string;
  urgency: 'URGENT' | 'NOT_URGENT';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills?: string;
  benefits?: string;
  isActive: boolean;
  createdAt: string;
  deadline?: string;
  employer: {
    id: string;
    name: string;
    companyProfile?: {
      companyName?: string;
      industry?: string;
      companySize?: string;
      logoUrl?: string;
      description?: string;
      website?: string;
      location?: string;
    };
  };
  _count: {
    applications: number;
  };
}

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      } else {
        toast.error('Job not found');
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to fetch job details');
      router.push('/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to apply for this job', {
        icon: '🔐',
      });
      router.push(`/auth/login?redirect=/jobs/${params.id}`);
      return;
    }
    router.push(`/jobs/${params.id}/apply`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEmploymentType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatExperienceLevel = (level: string) => {
    return level.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCompanyName = (job: Job) => {
    return job.employer?.companyProfile?.companyName || job.employer?.name || 'Company';
  };

  const parseJsonArray = (jsonString?: string) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opportunity: ${job?.title} at ${getCompanyName(job!)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!', {
        icon: '📋',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <HiringLoader size="xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link href="/jobs">
            <Button>Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shareJob}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                      {job.urgency === 'URGENT' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 animate-pulse">
                          <Zap className="h-4 w-4 mr-1" />
                          Urgent Hiring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-lg text-gray-600 mb-4">
                      <Building className="h-5 w-5 mr-2" />
                      <span className="font-medium">{getCompanyName(job)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.isRemote ? 'Remote' : job.location || 'Location not specified'}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {formatEmploymentType(job.employmentType)}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        {formatExperienceLevel(job.experienceLevel)}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {job._count.applications} applicants
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Posted {formatDate(job.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary */}
                {job.salaryMin && job.salaryMax && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-green-700">
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span className="text-xl font-semibold">
                        {job.currency === 'USD' ? '$' : '₹'}{job.salaryMin.toLocaleString()} - {job.currency === 'USD' ? '$' : '₹'}{job.salaryMax.toLocaleString()}
                      </span>
                      <span className="text-sm ml-2">per year</span>
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleApplyClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    disabled={isApplying}
                  >
                    {isApplying ? 'Processing...' : 'Apply for this Job'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && parseJsonArray(job.skills).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonArray(job.skills).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && parseJsonArray(job.benefits).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parseJsonArray(job.benefits).map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <Button 
                  onClick={handleApplyClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 mb-4"
                  disabled={isApplying}
                >
                  Apply Now
                </Button>
                <div className="text-sm text-gray-600 text-center">
                  {localStorage.getItem('authToken') ? 
                    'Click to apply for this position' : 
                    'Login required to apply'
                  }
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Company</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{getCompanyName(job)}</h4>
                    {job.employer?.companyProfile?.description && (
                      <p className="text-gray-600 text-sm">
                        {job.employer.companyProfile.description}
                      </p>
                    )}
                  </div>
                  
                  {job.employer?.companyProfile?.industry && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Industry:</span>
                      <p className="text-gray-900">{job.employer.companyProfile.industry}</p>
                    </div>
                  )}
                  
                  {job.employer?.companyProfile?.companySize && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Company Size:</span>
                      <p className="text-gray-900">{job.employer.companyProfile.companySize}</p>
                    </div>
                  )}
                  
                  {job.employer?.companyProfile?.location && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Headquarters:</span>
                      <p className="text-gray-900">{job.employer.companyProfile.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Job Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications</span>
                    <span className="font-medium">{job._count.applications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{formatDate(job.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium">{formatEmploymentType(job.employmentType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{formatExperienceLevel(job.experienceLevel)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
