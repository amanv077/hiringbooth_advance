// Utility functions for job management

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  category: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

export interface Application {
  id: string;
  status: string;
  createdAt: string;
  coverLetter: string;
  user: {
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

// API helper functions
export const jobApi = {
  // Fetch all jobs for an employer
  async fetchJobs(token: string): Promise<{ jobs: Job[] }> {
    const response = await fetch('/api/employer/jobs', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    return response.json();
  },

  // Update a job
  async updateJob(token: string, jobId: string, jobData: Partial<Job>): Promise<{ job: Job }> {
    const response = await fetch(`/api/employer/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error('Failed to update job');
    }

    return response.json();
  },

  // Toggle job status (active/inactive)
  async toggleJobStatus(token: string, jobId: string, isActive: boolean): Promise<{ job: Job }> {
    const response = await fetch(`/api/employer/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error('Failed to update job status');
    }

    return response.json();
  },

  // Fetch applications for an employer
  async fetchApplications(token: string): Promise<{ applications: Application[] }> {
    const response = await fetch('/api/employer/applications', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  },
};

// Filter functions
export const jobFilters = {
  // Filter active jobs
  getActiveJobs: (jobs: Job[]): Job[] => {
    return jobs.filter(job => job.isActive);
  },

  // Filter inactive jobs
  getInactiveJobs: (jobs: Job[]): Job[] => {
    return jobs.filter(job => !job.isActive);
  },

  // Filter jobs by search term
  searchJobs: (jobs: Job[], searchTerm: string): Job[] => {
    if (!searchTerm.trim()) return jobs;
    
    const term = searchTerm.toLowerCase();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job.category.toLowerCase().includes(term)
    );
  },
};

// Formatting utilities
export const formatters = {
  // Format date to readable string
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  },

  // Format salary range
  formatSalary: (min?: number, max?: number): string | null => {
    if (!min || !max) return null;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  },

  // Format enum values (replace underscores with spaces)
  formatEnumValue: (value: string): string => {
    return value?.replace(/_/g, ' ') || 'Not specified';
  },

  // Calculate days since creation
  daysSinceCreated: (dateString: string): number => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },
};

// Validation utilities
export const validators = {
  // Validate job form data
  validateJobData: (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Job title is required');
    }

    if (!data.description?.trim()) {
      errors.push('Job description is required');
    }

    if (!data.location?.trim()) {
      errors.push('Location is required');
    }

    if (data.salaryMin && data.salaryMax) {
      const min = parseInt(data.salaryMin);
      const max = parseInt(data.salaryMax);
      
      if (min >= max) {
        errors.push('Maximum salary must be greater than minimum salary');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Constants
export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'ENTRY_LEVEL', label: 'Entry Level' },
  { value: 'MID_LEVEL', label: 'Mid Level' },
  { value: 'SENIOR_LEVEL', label: 'Senior Level' },
  { value: 'EXECUTIVE_LEVEL', label: 'Executive Level' },
];

export const APPLICATION_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
];
