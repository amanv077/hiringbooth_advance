'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, Clock4, CheckCircle } from 'lucide-react';

interface Job {
  id: string;
  isActive: boolean;
  _count: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: string;
}

interface DashboardStatsProps {
  jobs: Job[];
  applications: Application[];
}

export function DashboardStats({ jobs, applications }: DashboardStatsProps) {
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.isActive).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'PENDING').length,
    acceptedApplications: applications.filter(app => app.status === 'ACCEPTED').length,
  };

  const statCards = [
    {
      title: 'Posted Jobs',
      value: stats.totalJobs,
      subtitle: `${stats.activeJobs} active`,
      icon: Briefcase,
      color: 'text-blue-600',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      subtitle: 'Across all jobs',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      subtitle: 'Need your attention',
      icon: Clock4,
      color: 'text-yellow-600',
    },
    {
      title: 'Hired',
      value: stats.acceptedApplications,
      subtitle: 'Successfully hired',
      icon: CheckCircle,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <IconComponent className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
