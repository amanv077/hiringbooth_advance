'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HiringLoader } from '@/components/ui/loader';
import { 
  ArrowLeft,
  Building,
  MapPin,
  Briefcase,
  DollarSign,
  Upload,
  FileText,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  isRemote: boolean;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  employer: {
    id: string;
    name: string;
    companyProfile?: {
      companyName?: string;
    };
  };
}

interface JobApplyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function JobApplyPage({ params }: JobApplyPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobAndCheckAuth = async () => {
      const { id } = await params;
      
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to apply for jobs', {
          icon: '🔐',
        });
        router.push(`/auth/login?redirect=/jobs/${id}/apply`);
        return;
      }

      fetchJob(id);
    };

    fetchJobAndCheckAuth();
  }, [params, router]);
  const fetchJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    if (coverLetter.length < 100) {
      toast.error('Cover letter must be at least 100 characters');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your application...');

    try {
      const { id } = await params;
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverLetter: coverLetter.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Application submitted successfully!', {
          id: loadingToast,
          icon: '🎉',
        });
        router.push('/user/applications');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit application', {
          id: loadingToast,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application', {
        id: loadingToast,
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatEmploymentType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCompanyName = (job: Job) => {
    return job.employer?.companyProfile?.companyName || job.employer?.name || 'Company';
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Job Details
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apply for Position</h1>
            <p className="text-gray-600">Submit your application for this exciting opportunity</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{getCompanyName(job)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{job.isRemote ? 'Remote' : job.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatEmploymentType(job.employmentType)}</span>
                    </div>

                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="font-medium">
                          {job.currency === 'USD' ? '$' : '₹'}{job.salaryMin.toLocaleString()} - {job.currency === 'USD' ? '$' : '₹'}{job.salaryMax.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Application</CardTitle>
                <p className="text-gray-600">Tell us why you're perfect for this role</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cover Letter */}
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={8}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 100 characters ({coverLetter.length}/100)
                    </p>
                  </div>

                  {/* Application Tips */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Application Tips
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Mention specific skills that match the job requirements</li>
                        <li>• Explain why you're interested in this company</li>
                        <li>• Highlight relevant experience and achievements</li>
                        <li>• Keep it concise but informative</li>
                        <li>• Proofread for spelling and grammar</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || coverLetter.length < 100}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="mt-6 bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Privacy & Data Protection</h4>
                <p className="text-sm text-gray-600">
                  Your application and personal information will be shared with the employer for this specific job opportunity. 
                  We protect your data according to our privacy policy and won't share it with third parties without your consent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
