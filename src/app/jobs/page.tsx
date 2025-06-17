'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HiringLoader } from '@/components/ui/loader';
import { Navbar, Footer } from '@/components/shared';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Building, 
  Search,
  Filter,
  Calendar,
  Users,
  Star,
  Zap,
  Eye,
  X,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { stripHtmlTags } from '@/lib/htmlUtils';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
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
    };
  };  _count: {
    applications: number;
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
  userRole: string | null;
  onApply: () => void;
  hasApplied: boolean;
}

function JobDetailModal({ job, isOpen, onClose, userRole, onApply, hasApplied }: JobDetailModalProps) {
  if (!isOpen) return null;

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
                            ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                            : job.salaryMin 
                              ? `${job.currency} ${job.salaryMin.toLocaleString()}+`
                              : `Up to ${job.currency} ${job.salaryMax?.toLocaleString()}`
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
                    {job.employer.companyProfile?.industry && (
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{job.employer.companyProfile.industry}</span>
                      </div>
                    )}
                    {job.employer.companyProfile?.companySize && (
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{job.employer.companyProfile.companySize}</span>
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
        </div>        {/* Action Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {userRole !== 'EMPLOYER' && (
              <>
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
              </>
            )}
            {userRole === 'EMPLOYER' && (
              <Button variant="outline" onClick={() => window.open('/employer/dashboard', '_blank')}>
                View Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchJobs();
    checkUserRole();
    
    // Refresh applications when component mounts (useful when returning from apply page)
    const token = localStorage.getItem('authToken');
    if (token && userRole === 'USER') {
      fetchUserApplications(token);
    }
  }, []);

  // Refresh applications when userRole changes
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && userRole === 'USER') {
      fetchUserApplications(token);
    }
  }, [userRole]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter, typeFilter, experienceFilter]);

  const checkUserRole = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      // Try employer profile first
      const employerResponse = await fetch('/api/employer/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (employerResponse.ok) {
        setUserRole('EMPLOYER');
        return;
      }

      // Try user profile if employer fails
      const userResponse = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (userResponse.ok) {
        setUserRole('USER');
        // Fetch user applications if user is logged in
        fetchUserApplications(token);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchUserApplications = async (token: string) => {
    try {
      const response = await fetch('/api/user/applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      } else {
        toast.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs.filter(job => job.isActive);

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer?.companyProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        (locationFilter === 'remote' && job.isRemote)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(job => job.employmentType === typeFilter);
    }

    if (experienceFilter) {
      filtered = filtered.filter(job => job.experienceLevel === experienceFilter);
    }

    setFilteredJobs(filtered);
  };

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
  };  const handleApplyClick = (jobId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to apply for jobs', {
        icon: '🔐',
      });
      router.push(`/auth/login?redirect=/jobs/${jobId}`);
      return;
    }

    if (userRole === 'EMPLOYER') {
      toast.error('Employers cannot apply for jobs. You can only post and manage jobs.', {
        icon: '⚠️',
      });
      return;
    }

    // Check if already applied
    if (hasAppliedToJob(jobId)) {
      toast.error('You have already applied to this job', {
        icon: '⚠️',
      });
      return;
    }

    router.push(`/jobs/${jobId}/apply`);
  };

  const getCompanyName = (job: Job) => {
    return job.employer?.companyProfile?.companyName || job.employer?.name || 'Company';
  };
  const parseSkills = (skillsJson?: string) => {
    if (!skillsJson) return [];
    try {
      return JSON.parse(skillsJson);
    } catch {
      return [];
    }
  };

  const hasAppliedToJob = (jobId: string) => {
    return userApplications.some(app => app.job.id === jobId);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <HiringLoader size="xl" />
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
              <p className="text-gray-600 mt-2">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Location or Remote"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Job Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Experience Level</label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="ENTRY_LEVEL">Entry Level</option>
                  <option value="MID_LEVEL">Mid Level</option>
                  <option value="SENIOR_LEVEL">Senior Level</option>
                  <option value="EXECUTIVE">Executive</option>
                </select>
              </div>
            </div>
          )}
        </div>        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
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
                      {job._count.applications} applicants
                    </div>
                  </div>

                  {/* Salary */}
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.currency === 'USD' ? '$' : '₹'}{job.salaryMin.toLocaleString()} - {job.currency === 'USD' ? '$' : '₹'}{job.salaryMax.toLocaleString()}
                      <span className="text-xs text-gray-500 ml-1">per year</span>
                    </div>
                  )}                  {/* Description */}
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
                  <div className="flex gap-2">                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                        setShowJobModal(true);
                      }}
                    >
                      View Details
                    </Button>                    {userRole !== 'EMPLOYER' && (
                      <>
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
                              handleApplyClick(job.id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Apply Now
                          </Button>
                        )}
                      </>
                    )}
                    {userRole === 'EMPLOYER' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/employer/dashboard');
                        }}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        View Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>        {/* No Jobs Found */}
        {filteredJobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setTypeFilter('');
                setExperienceFilter('');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>      <Footer />      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
          userRole={userRole}
          onApply={() => {
            setShowJobModal(false);
            setSelectedJob(null);
            handleApplyClick(selectedJob.id);
          }}
          hasApplied={hasAppliedToJob(selectedJob.id)}
        />
      )}
    </div>
  );
}
