'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HiringLoader } from '@/components/ui/loader';
import { Plus, Briefcase, Users, Eye, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { stripHtmlTags } from '@/lib/htmlUtils';
import { EmployerHeader } from '@/components/employer/EmployerHeader';
import { JobCard } from '@/components/employer/JobCardNew';
import { JobApplicationsView } from '@/components/employer/JobApplicationsView';
import { getApplicationStats } from '@/lib/employerUtils';

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
  applications?: Application[];
  _count?: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: 'PENDING' | 'VIEWED' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
  reviewedAt?: string;
  applicant: {
    id: string;
    email: string;
    userProfile?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      location?: string;
      bio?: string;
      skills?: string;
      experience?: string;
      education?: string;
      resumeUrl?: string;
      portfolioUrl?: string;
      linkedinUrl?: string;
      githubUrl?: string;
    };
  };
  job: {
    id: string;
    title: string;
  };
}

export default function EmployerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentView, setCurrentView] = useState<'overview' | 'jobs' | 'applications'>('overview');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem('authToken');
      if (token) {
        fetchEmployerProfile(token);
        fetchJobs(token);
        fetchApplications(token);
      } else {
        router.push('/auth/login');
      }
    }
  }, [isMounted, router]);  const fetchEmployerProfile = async (token: string) => {
    try {
      const response = await fetch('/api/employer/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        const errorData = await response.json();
        console.error('Profile fetch failed:', errorData);
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile', { icon: '❌' });
      // Set user to empty object to prevent infinite loading
      setUser({});
    }
  };
  const fetchJobs = async (token: string) => {
    try {
      const response = await fetch('/api/employer/jobs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs', { icon: '❌' });
      // Set jobs to empty array to prevent loading issues
      setJobs([]);
    }
  };
  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch('/api/employer/applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications', { icon: '❌' });
      // Set applications to empty array to prevent loading issues
      setApplications([]);
    }
  };  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setIsLoading(true);
    const loadingToast = toast.loading('Updating application status...');
    
    // Optimistically update the UI immediately
    const updateApplicationInState = (apps: Application[]) => 
      apps.map(app => 
        app.id === applicationId 
          ? { ...app, status: status as any, reviewedAt: new Date().toISOString() }
          : app
      );
    
    // Update applications state immediately
    setApplications(prev => updateApplicationInState(prev));
      // Update jobs state if the application is part of a job's applications
    setJobs(prev => prev.map(job => ({
      ...job,
      applications: job.applications ? updateApplicationInState(job.applications) : []
    })));
    
    // Update selectedJob if it's the one containing this application
    if (selectedJob && selectedJob.applications?.some(app => app.id === applicationId)) {
      setSelectedJob(prev => prev ? {
        ...prev,
        applications: prev.applications ? updateApplicationInState(prev.applications) : []
      } : null);
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/employer/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Application status updated successfully!', {
          id: loadingToast,
          icon: '✅',
        });
          // Update with the actual response data to ensure consistency
        setApplications(prev => prev.map(app => 
          app.id === applicationId ? data.application : app
        ));
        
        setJobs(prev => prev.map(job => ({
          ...job,
          applications: job.applications ? job.applications.map(app => 
            app.id === applicationId ? data.application : app
          ) : []
        })));
        
        // Update selectedJob if it contains this application
        if (selectedJob && selectedJob.applications?.some(app => app.id === applicationId)) {
          setSelectedJob(prev => prev ? {
            ...prev,
            applications: prev.applications ? prev.applications.map(app => 
              app.id === applicationId ? data.application : app
            ) : []
          } : null);
        }
        
      } else {
        // Revert the optimistic update on error
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: app.status } // This will revert to original state
            : app
        ));
        
        const error = await response.json();
        toast.error(error.error || 'Failed to update application status', {
          id: loadingToast,
          icon: '❌',
        });
        
        // Fetch fresh data to ensure consistency
        fetchApplications(token!);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status', {
        id: loadingToast,
        icon: '❌',
      });
      
      // Fetch fresh data on error
      const token = localStorage.getItem('authToken');
      if (token) {
        fetchApplications(token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, isActive: boolean) => {
    setIsLoading(true);
    const loadingToast = toast.loading(`${isActive ? 'Activating' : 'Deactivating'} job...`);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        toast.success(`Job ${isActive ? 'activated' : 'deactivated'} successfully!`, {
          id: loadingToast,
          icon: '✅',
        });
        fetchJobs(token!);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update job status', {
          id: loadingToast,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job status', {
        id: loadingToast,
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplications = (job: Job) => {
    const jobApplications = applications.filter(app => app.job.id === job.id);
    setSelectedJob({ ...job, applications: jobApplications });
    setCurrentView('applications');
  };

  const handleEditJob = (job: Job) => {
    router.push(`/employer/jobs/edit/${job.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/employer/profile-setup');
  };

  if (!isMounted) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <HiringLoader size="xl" />
      </div>
    );
  }

  // Get all stats for overview
  const activeJobs = jobs.filter(job => job.isActive).length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'PENDING').length;
  const acceptedApplications = applications.filter(app => app.status === 'ACCEPTED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <EmployerHeader
        user={user}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Status Warning */}
        {!user.isApproved && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Account Pending Approval</p>
                <p className="text-sm">Your employer account is under review. You'll be able to post jobs once approved by our admin team.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'overview' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user.profile?.companyName || user.email}!
              </h1>
              <p className="text-gray-600">Manage your job postings and review applications</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('jobs')}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {jobs.length - activeJobs} inactive
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600 flex-shrink-0" />
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                      <p className="text-xs text-gray-500">All time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-600">Pending Review</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
                      <p className="text-xs text-gray-500">Need attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 flex-shrink-0" />
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-600">Hired</p>
                      <p className="text-2xl font-bold text-gray-900">{acceptedApplications}</p>
                      <p className="text-xs text-gray-500">Success rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  {user.isApproved ? (
                    <Button onClick={() => router.push('/employer/jobs/create')} className="flex-1 sm:flex-none">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  ) : (
                    <Button disabled className="flex-1 sm:flex-none">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job (Approval Required)
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setCurrentView('jobs')} className="flex-1 sm:flex-none">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Manage Jobs
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentView('applications')} className="flex-1 sm:flex-none">
                    <Users className="h-4 w-4 mr-2" />
                    Review Applications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            {applications.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setCurrentView('applications')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b last:border-b-0 space-y-2 sm:space-y-0">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {application.applicant.userProfile?.firstName && application.applicant.userProfile?.lastName
                              ? `${application.applicant.userProfile.firstName} ${application.applicant.userProfile.lastName}`
                              : application.applicant.email}
                          </p>
                          <p className="text-sm text-gray-600 truncate">Applied for {application.job.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            application.status === 'VIEWED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Jobs View */}
        {currentView === 'jobs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
                <p className="text-gray-600">Manage your job postings and track performance</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setCurrentView('overview')}>
                  Back to Overview
                </Button>
                {user.isApproved && (
                  <Button onClick={() => router.push('/employer/jobs/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewApplications={handleViewApplications}
                    onEditJob={handleEditJob}
                    onToggleStatus={toggleJobStatus}
                    isLoading={isLoading}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                    <p className="text-gray-600 mb-4">
                      {user.isApproved 
                        ? 'Start by posting your first job to attract candidates'
                        : 'You\'ll be able to post jobs once your account is approved'}
                    </p>
                    {user.isApproved && (
                      <Button onClick={() => router.push('/employer/jobs/create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Job Applications View */}
        {currentView === 'applications' && selectedJob && (
          <JobApplicationsView
            job={selectedJob}
            applications={selectedJob.applications || []}
            onBack={() => {
              setCurrentView('jobs');
              setSelectedJob(null);
            }}
            onUpdateStatus={updateApplicationStatus}
            isLoading={isLoading}
          />
        )}

        {/* All Applications View */}
        {currentView === 'applications' && !selectedJob && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
                <p className="text-gray-600">Review applications across all your job postings</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView('overview')}>
                Back to Overview
              </Button>
            </div>

            {/* Jobs with Applications */}
            <div className="space-y-4">
              {jobs.filter(job => {
                const jobApps = applications.filter(app => app.job.id === job.id);
                return jobApps.length > 0;
              }).map((job) => {
                const jobApplications = applications.filter(app => app.job.id === job.id);
                const stats = getApplicationStats(jobApplications);
                
                return (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>{stats.total} total applications</span>
                            <span className="text-yellow-600">{stats.pending} pending</span>
                            <span className="text-green-600">{stats.accepted} accepted</span>
                            <span className="text-red-600">{stats.rejected} rejected</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleViewApplications({ ...job, applications: jobApplications })}
                          className="w-full sm:w-auto"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Review Applications ({stats.total})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {jobs.filter(job => {
                const jobApps = applications.filter(app => app.job.id === job.id);
                return jobApps.length > 0;
              }).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600">Applications will appear here when candidates apply to your jobs</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
