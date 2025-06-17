'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HiringLoader } from '@/components/ui/loader';
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
  Zap
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
  };
  _count: {
    applications: number;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
    checkUserRole();
  }, []);

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
      }
    } catch (error) {
      console.error('Error checking user role:', error);
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
  };
  const handleApplyClick = (jobId: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <HiringLoader size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
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
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 group"
              onClick={() => router.push(`/jobs/${job.id}`)}
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
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/jobs/${job.id}`);
                      }}
                    >
                      View Details                    </Button>
                    {userRole !== 'EMPLOYER' && (
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
        </div>

        {/* No Jobs Found */}
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
      </div>
    </div>
  );
}
