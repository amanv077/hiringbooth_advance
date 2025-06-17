'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, MapPin, Clock, Building, Eye, CheckCircle, XCircle, Clock4, User, LogOut, Calendar, Users, Star, Zap, DollarSign, X } from 'lucide-react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared';
import toast from 'react-hot-toast';
import { stripHtmlTags } from '@/lib/htmlUtils';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  isRemote?: boolean;
  employmentType: string;
  experienceLevel: string;
  urgency?: 'URGENT' | 'NOT_URGENT';
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills?: string;
  benefits?: string;
  isActive?: boolean;
  createdAt: string;
  deadline?: string;
  employer?: {
    id: string;
    name: string;
    companyProfile?: {
      companyName?: string;
      industry?: string;
      companySize?: string;
      logoUrl?: string;
    };
  };
  company?: {
    companyProfile?: {
      companyName?: string;
      industry?: string;
      companySize?: string;
    };
  };
  _count?: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  coverLetter: string;
  job: {
    id: string;
    title: string;
    company: {
      companyProfile: {
        companyName: string;
      };
    };
  };
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatEmploymentType = (type: string) => {
  return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const formatExperienceLevel = (level: string) => {
  return level.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Job Detail Modal Component
interface JobDetailModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  hasApplied: boolean;
}

function JobDetailModal({ job, isOpen, onClose, onApply, hasApplied }: JobDetailModalProps) {
  if (!isOpen) return null;

  const getCompanyName = (job: Job) => {
    return job.employer?.companyProfile?.companyName || 
           job.company?.companyProfile?.companyName || 
           job.employer?.name || 
           'Company';
  };

  const parseJsonArray = (jsonString?: string) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{job.title}</h2>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <Building className="h-4 w-4 mr-2" />
              {getCompanyName(job)}
            </p>
            {job.urgency === 'URGENT' && (
              <div className="flex items-center text-red-600 mt-2">
                <Zap className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Urgent Hiring</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Job Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{job.isRemote ? 'Remote' : job.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{formatEmploymentType(job.employmentType)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{formatExperienceLevel(job.experienceLevel)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                        <span>
                          {job.salaryMin && job.salaryMax 
                            ? `${job.currency || '$'} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                            : job.salaryMin 
                              ? `${job.currency || '$'} ${job.salaryMin.toLocaleString()}+`
                              : `Up to ${job.currency || '$'} ${job.salaryMax?.toLocaleString()}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Company Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{getCompanyName(job)}</span>
                    </div>
                    {(job.employer?.companyProfile?.industry || job.company?.companyProfile?.industry) && (
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{job.employer?.companyProfile?.industry || job.company?.companyProfile?.industry}</span>
                      </div>
                    )}
                    {(job.employer?.companyProfile?.companySize || job.company?.companyProfile?.companySize) && (
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{job.employer?.companyProfile?.companySize || job.company?.companyProfile?.companySize}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonArray(job.skills).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Benefits</h3>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {hasApplied ? (
              <Button disabled className="bg-green-600 text-white">
                <CheckCircle className="h-4 w-4 mr-2" />
                Applied
              </Button>
            ) : (
              <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700">
                Apply for this Job
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUserProfile(token);
    fetchJobs(token);
    fetchApplications(token);
  }, [router]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('authToken');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchJobs = async (token: string) => {
    try {
      const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/jobs${queryParams}`);

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch('/api/user/applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleJobSearch = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchJobs(token);
    }
  };

  const handleApplyToJob = async () => {
    if (!selectedJob || !coverLetter.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ coverLetter }),
      });

      if (response.ok) {
        toast.success('Application submitted successfully!', {
          icon: '🎉',
        });
        setShowApplyModal(false);
        setShowJobModal(false);
        setCoverLetter('');
        setSelectedJob(null);
        if (token) {
          fetchApplications(token);
        }
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit application', {
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('An error occurred while submitting your application', {
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'ACCEPTED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock4 className="h-4 w-4" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock4 className="h-4 w-4" />;
    }
  };

  const hasAppliedToJob = (jobId: string) => {
    return applications.some(app => app.job.id === jobId);
  };

  const getCompanyName = (job: Job) => {
    return job.employer?.companyProfile?.companyName || 
           job.company?.companyProfile?.companyName || 
           job.employer?.name || 
           'Company';
  };

  const parseSkills = (skillsJson?: string) => {
    if (!skillsJson) return [];
    try {
      return JSON.parse(skillsJson);
    } catch {
      return [];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Find your next opportunity and track your applications
          </p>
        </div>        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock4 className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'ACCEPTED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'REJECTED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Applications ({applications.length})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{application.job.title}</p>
                          <p className="text-xs text-gray-600">{application.job.company?.companyProfile?.companyName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-gray-500 text-sm">No applications yet</p>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setActiveTab('applications')}
                    >
                      View All Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Application Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-medium">{applications.filter(app => app.status === 'PENDING').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Accepted</span>
                      </div>
                      <span className="font-medium">{applications.filter(app => app.status === 'ACCEPTED').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm">Rejected</span>
                      </div>
                      <span className="font-medium">{applications.filter(app => app.status === 'REJECTED').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('jobs')} 
                    className="flex items-center justify-center h-16"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/user/profile-setup')} 
                    className="flex items-center justify-center h-16"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Update Profile
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('applications')} 
                    className="flex items-center justify-center h-16"
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    My Applications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Application Success Rate */}
            {applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-600" />
                    Application Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((applications.filter(app => app.status === 'ACCEPTED').length / applications.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {applications.filter(app => app.status === 'PENDING').length}
                      </div>
                      <div className="text-sm text-gray-600">Awaiting Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {applications.length > 0 ? Math.round(applications.length / 30) : 0}
                      </div>
                      <div className="text-sm text-gray-600">Applications This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}        {activeTab === 'jobs' && (
          <div>
            {/* Job Search */}
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search for jobs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleJobSearch()}
                    />
                  </div>
                </div>
                <Button onClick={handleJobSearch}>
                  Search
                </Button>
              </div>
            </div>            {/* Jobs List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 group"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobModal(true);
                  }}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.urgency === 'URGENT' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                              <Zap className="h-3 w-3 mr-1" />
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          <span className="font-medium">{getCompanyName(job)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(job.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.isRemote ? 'Remote' : job.location || 'Location not specified'}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {formatEmploymentType(job.employmentType)}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {formatExperienceLevel(job.experienceLevel)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job._count?.applications || 0} applicants
                        </div>
                      </div>

                      {/* Salary */}
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salaryMin && job.salaryMax 
                            ? `${job.currency || '$'} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                            : job.salaryMin 
                              ? `${job.currency || '$'} ${job.salaryMin.toLocaleString()}+`
                              : `Up to ${job.currency || '$'} ${job.salaryMax?.toLocaleString()}`
                          }
                          <span className="text-xs text-gray-500 ml-1">per year</span>
                        </div>
                      )}

                      {/* Description */}
                      <div className="text-gray-700 text-sm line-clamp-2">
                        {stripHtmlTags(job.description)}
                      </div>

                      {/* Skills */}
                      {job.skills && parseSkills(job.skills).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {parseSkills(job.skills).slice(0, 4).map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {parseSkills(job.skills).length > 4 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                              +{parseSkills(job.skills).length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Posted {formatDate(job.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                            setShowJobModal(true);
                          }}
                        >
                          View Details
                        </Button>
                        {hasAppliedToJob(job.id) ? (
                          <Button 
                            size="sm"
                            disabled
                            className="bg-green-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Applied
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              setShowApplyModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {jobs.length === 0 && (
                <Card className="lg:col-span-2">
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Application Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={applicationFilter}
                  onChange={(e) => setApplicationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Applications</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="status">By Status</option>
                  <option value="company">By Company</option>
                </select>
              </div>
            </div>

            {/* Filtered Applications */}
            <div className="space-y-4">
              {applications
                .filter(app => applicationFilter === 'all' || app.status === applicationFilter)
                .sort((a, b) => {
                  switch (sortBy) {
                    case 'newest':
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    case 'oldest':
                      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    case 'status':
                      return a.status.localeCompare(b.status);
                    case 'company':
                      return (a.job.company?.companyProfile?.companyName || '').localeCompare(
                        b.job.company?.companyProfile?.companyName || ''
                      );
                    default:
                      return 0;
                  }
                })
                .map((application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.job.title}
                            </h3>
                            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              {application.status}
                            </span>
                          </div>
                          
                          <p className="text-blue-600 font-medium mb-2 flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {application.job.company?.companyProfile?.companyName || 'Company Name'}
                          </p>
                          
                          <div className="flex items-center text-gray-600 text-sm mb-3 gap-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied on {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                            <p className="text-gray-700 text-sm">
                              {application.coverLetter.length > 150 
                                ? `${application.coverLetter.substring(0, 150)}...` 
                                : application.coverLetter}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const fullJob = jobs.find(j => j.id === application.job.id);
                              if (fullJob) {
                                setSelectedJob(fullJob);
                                setShowJobModal(true);
                              } else {
                                router.push(`/jobs/${application.job.id}`);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
              
              {applications.filter(app => applicationFilter === 'all' || app.status === applicationFilter).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {applicationFilter === 'all' ? 'No applications yet' : `No ${applicationFilter.toLowerCase()} applications`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {applicationFilter === 'all' 
                        ? 'Start applying to jobs to see your applications here' 
                        : `You don't have any ${applicationFilter.toLowerCase()} applications yet`}
                    </p>
                    <Button onClick={() => setActiveTab('jobs')}>
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}</div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
          onApply={() => {
            setShowJobModal(false);
            setShowApplyModal(true);
          }}
          hasApplied={hasAppliedToJob(selectedJob.id)}
        />
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Apply for {selectedJob?.title}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell the employer why you're interested in this position..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApplyModal(false);
                  setCoverLetter('');
                  setSelectedJob(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyToJob}
                disabled={isLoading || !coverLetter.trim()}
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
