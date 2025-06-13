```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, MapPin, Clock, Building, Eye, CheckCircle, XCircle, Clock4, User, LogOut } from 'lucide-react';
import Link from 'next/link';

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
  createdAt: string;
  company: {
    companyProfile: {
      companyName: string;
    };
  };
  _count: {
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

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
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

  const fetchJobs = async (token: string, search = '') => {
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

  const handleApplyToJob = async () => {
    if (!selectedJob) return;
    
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
        alert('Application submitted successfully!');
        setShowApplyModal(false);
        setCoverLetter('');
        setSelectedJob(null);
        fetchApplications(token!);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to apply to job');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply to job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchJobs(token, searchTerm);
    }
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
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.job.id === jobId);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
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
              <span className="ml-4 text-gray-600">Job Seeker Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.profile?.firstName || user.email}!</span>
              <Button variant="outline" onClick={() => router.push('/user/profile-setup')}>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
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
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <Button variant={activeTab === 'browse' ? 'solid' : 'outline'} onClick={() => setActiveTab('browse')} className="mr-2">
            Browse Jobs
          </Button>
          <Button variant={activeTab === 'applications' ? 'solid' : 'outline'} onClick={() => setActiveTab('applications')}>
            My Applications
          </Button>
        </div>

        {/* Browse Jobs Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Search className="h-5 w-5 text-gray-400 ml-3" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 focus:ring-0 focus:outline-none py-3 pl-0 pr-3"
                />
                <Button type="submit" variant="primary" className="rounded-l-none">
                  Search
                </Button>
              </div>
            </form>

            {/* Jobs List */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {job.location} • {job.type}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3">{job.description}</p>
                  </CardContent>
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{job.company.companyProfile.companyName}</span>
                    </div>
                    <Button
                      variant={hasApplied(job.id) ? 'default' : 'primary'}
                      onClick={() => {
                        if (hasApplied(job.id)) {
                          alert('You have already applied to this job.');
                        } else {
                          setSelectedJob(job);
                          setShowApplyModal(true);
                        }
                      }}
                    >
                      {hasApplied(job.id) ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </Card>
              ))}
              
              {jobs.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">You haven't applied to any jobs yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {application.job.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {application.job.location} • {application.job.type}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3">{application.job.description}</p>
                    </CardContent>
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{application.job.company.companyProfile.companyName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium rounded-full px-3 py-1 ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <Button
                          variant="link"
                          onClick={() => {
                            setSelectedJob(application.job);
                            setShowApplyModal(true);
                          }}
                          className="ml-4"
                        >
                          Edit Application
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <Card className="relative max-w-lg w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {selectedJob ? `Apply for ${selectedJob.title}` : 'Apply for Job'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                {selectedJob?.description}
              </p>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none h-24"
                placeholder="Write your cover letter here..."
              ></textarea>
            </CardContent>
            <div className="flex justify-end p-4 border-t">
              <Button variant="outline" onClick={() => setShowApplyModal(false)} className="mr-2">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleApplyToJob} isLoading={isLoading}>
                Submit Application
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
```