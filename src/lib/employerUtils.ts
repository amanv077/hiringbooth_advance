// Utility functions for employer dashboard

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'viewed':
    case 'reviewed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '⏳';
    case 'viewed':
    case 'reviewed':
      return '👀';
    case 'accepted':
      return '✅';
    case 'rejected':
      return '❌';
    default:
      return '📄';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatSalary = (min?: number, max?: number, currency = 'INR'): string => {
  if (!min || !max) return 'Salary not specified';
  return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
};

export const formatJobType = (type: string): string => {
  return type?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified';
};

export const formatExperienceLevel = (level: string): string => {
  return level?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified';
};

export const getJobStatusBadge = (isActive: boolean, urgency?: string): { text: string; className: string } => {
  if (!isActive) {
    return {
      text: 'Inactive',
      className: 'bg-gray-100 text-gray-700 border-gray-200'
    };
  }
  
  if (urgency === 'URGENT') {
    return {
      text: '🔥 Urgent',
      className: 'bg-red-100 text-red-700 border-red-200 animate-pulse'
    };
  }
  
  return {
    text: 'Active',
    className: 'bg-green-100 text-green-700 border-green-200'
  };
};

export const getApplicationStats = (applications: any[]) => {
  const total = applications.length;
  const pending = applications.filter(app => app.status === 'PENDING').length;
  const reviewed = applications.filter(app => app.status === 'VIEWED').length;
  const accepted = applications.filter(app => app.status === 'ACCEPTED').length;
  const rejected = applications.filter(app => app.status === 'REJECTED').length;

  return { total, pending, reviewed, accepted, rejected };
};
