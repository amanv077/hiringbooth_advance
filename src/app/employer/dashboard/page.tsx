'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HiringLoader } from '@/components/ui/loader';
import { Plus, Building, Users, Eye, CheckCircle, XCircle, Clock4, User, LogOut, Briefcase } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  category: string;
  experienceLevel: string;
  urgency: 'URGENT' | 'NOT_URGENT';
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  createdAt: string;
  applications: Application[];
  _count: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  coverLetter: string;
  applicant: {
    email: string;
    userProfile: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      location?: string;
      skills?: string;
      experience?: string;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [jobsSubTab, setJobsSubTab] = useState('active'); // 'active' or 'inactive'
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showJobEditModal, setShowJobEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined' || !isMounted) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }    fetchEmployerProfile(token);
    fetchJobs(token);
    fetchApplications(token);
  }, [router, isMounted]);

  const fetchEmployerProfile = async (token: string) => {
    try {
      const response = await fetch('/api/employer/profile', {
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
      const response = await fetch('/api/employer/jobs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

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
      const response = await fetch('/api/employer/applications', {
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
  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setIsLoading(true);
    const loadingToast = toast.loading('Updating application status...');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/employer/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },        body: JSON.stringify({ status }),
      });      if (response.ok) {
        toast.success('Application status updated successfully!', {
          id: loadingToast,
          icon: '✅',
        });
        fetchApplications(token!);
        setShowApplicationModal(false);
        setSelectedApplication(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update application status', {
          id: loadingToast,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status', {
        id: loadingToast,
        icon: '❌',
      });
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
          icon: isActive ? '✅' : '⏸️',
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

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setShowJobEditModal(true);
  };
  const handleUpdateJob = async (jobData: any) => {
    if (!selectedJob) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading('Updating job...');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/employer/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        toast.success('Job updated successfully!', {
          id: loadingToast,
          icon: '📝',
        });
        fetchJobs(token!);
        setShowJobEditModal(false);
        setSelectedJob(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update job', {
          id: loadingToast,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job', {
        id: loadingToast,
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock4 className="h-4 w-4 text-yellow-500" />;
      case 'REVIEWED': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock4 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'REVIEWED': return 'text-blue-600 bg-blue-50';
      case 'ACCEPTED': return 'text-green-600 bg-green-50';
      case 'REJECTED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    router.push('/');
  };

  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'PENDING').length;
  const reviewedApplications = applications.filter(app => app.status === 'REVIEWED').length;
  const acceptedApplications = applications.filter(app => app.status === 'ACCEPTED').length;  if (!isMounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <HiringLoader size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                HiringBooth
              </Link>
              <span className="ml-4 text-gray-600">Employer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.profile?.companyName || user.email}!
              </span>
              {!user.isApproved && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Pending Approval
                </span>
              )}
              <Button variant="outline" onClick={() => router.push('/employer/profile-setup')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Status Warning */}
        {!user.isApproved && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Account Pending Approval</p>
            <p className="text-sm">Your employer account is under review. You'll be able to post jobs once approved by our admin team.</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => {
              setActiveTab('jobs');
              setJobsSubTab('active');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.filter(job => job.isActive).length}</p>
                  <p className="text-xs text-gray-500">
                    {jobs.filter(job => !job.isActive).length} inactive
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setActiveTab('applications')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setActiveTab('applications')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock4 className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setActiveTab('applications')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{acceptedApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
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
            </button>            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Job Management
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Applications
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {user.isApproved ? (
                    <Button onClick={() => router.push('/employer/jobs/create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  ) : (
                    <Button disabled>
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job (Approval Required)
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setActiveTab('applications')}>
                    <Users className="h-4 w-4 mr-2" />
                    Review Applications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex justify-between items-center py-3 border-b last:border-b-0">                    <div>
                      <p className="font-medium text-gray-900">
                        {application.applicant.userProfile?.firstName} {application.applicant.userProfile?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Applied for {application.job.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(application.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No applications yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Management</h2>
              {user.isApproved && (
                <Button onClick={() => router.push('/employer/jobs/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              )}
            </div>

            {/* Jobs Sub-tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setJobsSubTab('active')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  jobsSubTab === 'active'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active Jobs ({jobs.filter(job => job.isActive).length})
              </button>
              <button
                onClick={() => setJobsSubTab('inactive')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  jobsSubTab === 'inactive'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inactive Jobs ({jobs.filter(job => !job.isActive).length})
              </button>
            </div>

            <div className="space-y-4">
              {jobs.filter(job => jobsSubTab === 'active' ? job.isActive : !job.isActive).map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          {job.urgency === 'URGENT' && (
                            <span className="ml-3 px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50 animate-pulse">
                              🔥 Urgent
                            </span>
                          )}
                          {jobsSubTab === 'inactive' && (
                            <span className="ml-3 px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-50">
                              Inactive
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className="text-gray-700 mb-3 line-clamp-2" 
                          dangerouslySetInnerHTML={{ __html: job.description || 'No description available' }}
                        />                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>{job.location || 'Location not specified'}</span>
                          <span>{job.type?.replace('_', ' ') || 'Type not specified'}</span>
                          <span>{job.experienceLevel?.replace('_', ' ') || 'Experience not specified'}</span>
                          <span>{job._count?.applications || 0} applications</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                          <span>📅 Created: {formatDate(job.createdAt)}</span>
                        </div>
                        
                        {job.salaryMin && job.salaryMax && (
                          <div className="mt-2">
                            <span className="text-green-600 font-semibold">
                              ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex space-x-2">                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, !job.isActive)}
                          disabled={isLoading}
                        >
                          {jobsSubTab === 'active' ? 'Deactivate' : 'Reactivate'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>              ))}
              
              {jobs.filter(job => jobsSubTab === 'active' ? job.isActive : !job.isActive).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    {jobsSubTab === 'active' ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
                        <p className="text-gray-600 mb-4">
                          {jobs.length > 0 ? 'All your jobs are currently inactive' : 'Start by posting your first job'}
                        </p>
                        {user.isApproved && jobs.length === 0 && (
                          <Button onClick={() => router.push('/employer/jobs/create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Post Your First Job
                          </Button>
                        )}
                        {!user.isApproved && (
                          <p className="text-sm text-yellow-600">Account approval required to post jobs</p>
                        )}
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No inactive jobs</h3>
                        <p className="text-gray-600">All your jobs are currently active or you haven't posted any jobs yet.</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Applications</h2>
            
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.applicant.userProfile?.firstName} {application.applicant.userProfile?.lastName}
                        </h3>
                        <p className="text-gray-600 mb-2">Applied for: {application.job.title}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          Email: {application.applicant.email}
                        </p>
                        {application.applicant.userProfile?.location && (
                          <p className="text-sm text-gray-500 mb-2">
                            Location: {application.applicant.userProfile.location}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="ml-6 flex items-center space-x-4">
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApplicationModal(true);
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {applications.length === 0 && (
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

      {/* Application Review Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Application Review</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900">Applicant Details</h4>
                <p>Name: {selectedApplication.applicant.userProfile?.firstName} {selectedApplication.applicant.userProfile?.lastName}</p>
                <p>Email: {selectedApplication.applicant.email}</p>
                {selectedApplication.applicant.userProfile?.phoneNumber && (
                  <p>Phone: {selectedApplication.applicant.userProfile.phoneNumber}</p>
                )}
                {selectedApplication.applicant.userProfile?.location && (
                  <p>Location: {selectedApplication.applicant.userProfile.location}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Position</h4>
                <p>{selectedApplication.job.title}</p>
              </div>
              
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="font-medium text-gray-900">Cover Letter</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              )}
              
              {selectedApplication.applicant.userProfile?.skills && (
                <div>
                  <h4 className="font-medium text-gray-900">Skills</h4>
                  <p className="text-gray-700">{selectedApplication.applicant.userProfile.skills}</p>
                </div>
              )}
              
              {selectedApplication.applicant.userProfile?.experience && (
                <div>
                  <h4 className="font-medium text-gray-900">Experience</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.applicant.userProfile.experience}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApplicationModal(false);
                    setSelectedApplication(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'REVIEWED')}
                  disabled={isLoading || selectedApplication.status === 'REVIEWED'}
                >
                  Mark as Reviewed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'REJECTED')}
                  disabled={isLoading || selectedApplication.status === 'REJECTED'}
                  className="text-red-600 hover:text-red-700"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'ACCEPTED')}
                  disabled={isLoading || selectedApplication.status === 'ACCEPTED'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Edit Modal */}
      {showJobEditModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Job</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={selectedJob.title}
                  onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={selectedJob.description}
                  onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={selectedJob.location}
                  onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={selectedJob.type}
                  onChange={(e) => setSelectedJob({ ...selectedJob, type: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select job type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={selectedJob.experienceLevel}
                  onChange={(e) => setSelectedJob({ ...selectedJob, experienceLevel: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select experience level</option>
                  <option value="ENTRY_LEVEL">Entry Level</option>
                  <option value="MID_LEVEL">Mid Level</option>
                  <option value="SENIOR_LEVEL">Senior Level</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <select
                  value={selectedJob.urgency || 'NOT_URGENT'}
                  onChange={(e) => setSelectedJob({ ...selectedJob, urgency: e.target.value as 'URGENT' | 'NOT_URGENT' })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                >
                  <option value="NOT_URGENT">Not Urgent</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={selectedJob.salaryMin || ''}
                    onChange={(e) => setSelectedJob({ ...selectedJob, salaryMin: Number(e.target.value) })}
                    placeholder="Min"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={selectedJob.salaryMax || ''}
                    onChange={(e) => setSelectedJob({ ...selectedJob, salaryMax: Number(e.target.value) })}
                    placeholder="Max"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowJobEditModal(false);
                  setSelectedJob(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateJob(selectedJob)}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Updating...' : 'Update Job'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}