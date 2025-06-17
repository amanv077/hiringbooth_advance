'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Filter, Search } from 'lucide-react';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationModal } from './ApplicationModal';
import { getApplicationStats } from '@/lib/employerUtils';

interface JobApplicationsViewProps {
  job: any;
  applications: any[];
  onBack: () => void;
  onUpdateStatus: (applicationId: string, status: string) => void;
  isLoading: boolean;
}

export function JobApplicationsView({ 
  job, 
  applications, 
  onBack, 
  onUpdateStatus, 
  isLoading 
}: JobApplicationsViewProps) {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getApplicationStats(applications);
  
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.applicant.userProfile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.applicant.userProfile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    await onUpdateStatus(applicationId, status);
    if (selectedApplication?.id === applicationId) {
      // Update the selected application status
      setSelectedApplication({
        ...selectedApplication,
        status: status === 'REVIEWED' ? 'VIEWED' : status
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">Applications Management</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search applicants by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Status ({stats.total})</option>
                <option value="PENDING">Pending ({stats.pending})</option>
                <option value="VIEWED">Reviewed ({stats.reviewed})</option>
                <option value="ACCEPTED">Accepted ({stats.accepted})</option>
                <option value="REJECTED">Rejected ({stats.rejected})</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
              isLoading={isLoading}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'No applications match your filters' 
                  : 'No applications yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Applications will appear here when candidates apply to this job'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Detail Modal */}
      <ApplicationModal
        application={selectedApplication}
        isOpen={showModal}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        isLoading={isLoading}
      />
    </div>
  );
}
