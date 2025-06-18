'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Building, CheckCircle, XCircle, Clock4, User, LogOut, Eye, ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Loader } from '@/components/ui/loader';
import toast from 'react-hot-toast';
import { stripHtmlTags } from '@/lib/htmlUtils';

interface DashboardStats {
  totalUsers: number;
  totalJobSeekers: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
  pendingApprovals: number;
  totalApplications: number;
  verifiedUsers: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  userProfile?: {
    phone?: string;
    location?: string;
    bio?: string;
    skills?: string;
    experience?: string;
    education?: string;
    resumeUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  companyProfile?: {
    companyName: string;
    industry?: string;
    companySize?: string;
    website?: string;
    description?: string;
    location?: string;
    logoUrl?: string;
  };
  jobsPosted?: Array<{
    id: string;
    title: string;
    isActive: boolean;
  }>;
  applications?: Array<{
    id: string;
    status: string;
    job: {
      title: string;
    };
  }>;
}

interface PendingEmployer {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  companyProfile?: {
    companyName: string;
    industry?: string;
    companySize?: string;
    website?: string;
    description?: string;
    location?: string;
    logoUrl?: string;
  };
  jobsPosted?: Array<{
    id: string;
    title: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingEmployers, setPendingEmployers] = useState<PendingEmployer[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedEmployer, setSelectedEmployer] = useState<PendingEmployer | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [usersListType, setUsersListType] = useState<'all' | 'jobseekers' | 'employers'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchAdminData(token);
    fetchDashboardStats(token);
    fetchPendingEmployers(token);
  }, [router]);

  const fetchAdminData = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role !== 'ADMIN') {
          router.push('/auth/login');
          return;
        }
        setAdmin(data.user);
      } else {
        localStorage.removeItem('authToken');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchDashboardStats = async (token: string) => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchPendingEmployers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/pending-employers', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingEmployers(data.pendingEmployers);
      }
    } catch (error) {
      console.error('Error fetching pending employers:', error);
    }
  };

  const fetchUsersList = async (role?: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      
      const response = await fetch(`/api/admin/users-list?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReject = async (userId: string, action: 'approve' | 'reject', reason?: string) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/pending-employers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, action, reason }),
      });

      if (response.ok) {
        toast.success(`Employer ${action}d successfully!`, {
          icon: action === 'approve' ? '✅' : '❌',
        });
        fetchPendingEmployers(token!);
        fetchDashboardStats(token!);
        setShowEmployerModal(false);
        setSelectedEmployer(null);
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${action} employer`, {
          icon: '⚠️',
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing employer:`, error);
      toast.error(`Failed to ${action} employer`, {
        icon: '⚠️',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleStatsCardClick = (type: 'all' | 'jobseekers' | 'employers') => {
    setUsersListType(type);
    setShowUsersList(true);
    setActiveTab('users-list');
    fetchUsersList(type === 'all' ? undefined : type === 'jobseekers' ? 'USER' : 'EMPLOYER');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  if (!admin || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
              <span className="ml-4 text-gray-600">Admin Dashboard</span>
            </div>            <div className="flex items-center space-x-4">
              <Link href="/admin/user-data">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Management
                </Button>
              </Link>
              <span className="text-gray-700">Welcome, {admin.name}!</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleStatsCardClick('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-blue-600 hover:text-blue-800">Click to view all</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleStatsCardClick('jobseekers')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Job Seekers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobSeekers}</p>
                  <p className="text-xs text-green-600 hover:text-green-800">Click to view all</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleStatsCardClick('employers')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployers}</p>
                  <p className="text-xs text-purple-600 hover:text-purple-800">Click to view all</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setActiveTab('approvals')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock4 className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                  <p className="text-xs text-yellow-600 hover:text-yellow-800">Click to review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-teal-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'approvals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Approvals ({stats.pendingApprovals})
            </button>
            {showUsersList && (
              <button
                onClick={() => setActiveTab('users-list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'users-list'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {usersListType === 'all' ? 'All Users' : 
                 usersListType === 'jobseekers' ? 'Job Seekers' : 'Employers'}
              </button>
            )}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingEmployers.slice(0, 5).map((employer) => (
                    <div key={employer.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-b-0 space-y-2 sm:space-y-0">
                      <div>
                        <p className="font-medium text-gray-900">
                          {employer.companyProfile?.companyName || employer.name}
                        </p>
                        <p className="text-sm text-gray-600">New employer registration</p>
                        <p className="text-xs text-gray-500">
                          {new Date(employer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('pending')} self-start sm:self-center`}>
                        Pending Approval
                      </span>
                    </div>
                  ))}
                  {pendingEmployers.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No pending approvals</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/admin/user-data">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300">
                      <Users className="h-6 w-6 text-blue-600" />
                      <span className="text-sm font-medium">User Data</span>
                      <span className="text-xs text-gray-500">Manage & Export</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300"
                    onClick={() => setActiveTab('approvals')}
                  >
                    <Clock4 className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">Approvals</span>
                    <span className="text-xs text-gray-500">{stats.pendingApprovals} pending</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                    onClick={() => {
                      setUsersListType('all');
                      setShowUsersList(true);
                      setActiveTab('users-list');
                    }}
                  >
                    <User className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">All Users</span>
                    <span className="text-xs text-gray-500">{stats.totalUsers} total</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Jobs:</span>
                      <span className="font-semibold">{stats.totalJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Jobs:</span>
                      <span className="font-semibold text-green-600">{stats.activeJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Applications:</span>
                      <span className="font-semibold">{stats.totalApplications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Verified Users:</span>
                      <span className="font-semibold text-blue-600">{stats.verifiedUsers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Job Seekers:</span>
                      <span className="font-semibold text-green-600">{stats.totalJobSeekers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Employers:</span>
                      <span className="font-semibold text-purple-600">{stats.totalEmployers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Approvals:</span>
                      <span className="font-semibold text-yellow-600">{stats.pendingApprovals}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-semibold text-blue-600">
                        {stats.totalEmployers > 0 
                          ? Math.round(((stats.totalEmployers - stats.pendingApprovals) / stats.totalEmployers) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employer Accounts Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEmployers.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEmployers.map((employer) => (
                      <div key={employer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {employer.companyProfile?.companyName || employer.name}
                                </h3>
                                <p className="text-sm text-gray-600">{employer.email}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="text-sm"><strong>Industry:</strong> {employer.companyProfile?.industry || 'Not specified'}</p>
                                <p className="text-sm"><strong>Company Size:</strong> {employer.companyProfile?.companySize || 'Not specified'}</p>
                                <p className="text-sm"><strong>Location:</strong> {employer.companyProfile?.location || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Website:</strong> {employer.companyProfile?.website || 'Not provided'}</p>
                                <p className="text-sm"><strong>Jobs Posted:</strong> {employer.jobsPosted?.length || 0}</p>
                                <p className="text-sm"><strong>Registered:</strong> {new Date(employer.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {employer.companyProfile?.description && (
                              <div className="mt-3">
                                <p className="text-sm"><strong>Description:</strong></p>
                                <p className="text-sm text-gray-600 mt-1">{employer.companyProfile?.description}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2 lg:ml-4 w-full lg:w-auto">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedEmployer(employer);
                                setShowEmployerModal(true);
                              }}
                              className="w-full lg:w-auto"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproveReject(employer.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 w-full lg:w-auto"
                              disabled={isProcessing}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApproveReject(employer.id, 'reject')}
                              disabled={isProcessing}
                              className="w-full lg:w-auto"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users List Tab */}
        {activeTab === 'users-list' && showUsersList && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUsersList(false);
                    setActiveTab('overview');
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Overview
                </Button>
                <h2 className="text-xl font-semibold">
                  {usersListType === 'all' ? 'All Users' : 
                   usersListType === 'jobseekers' ? 'Job Seekers' : 'Employers'}
                </h2>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                user.role === 'USER' ? 'bg-green-100' : 'bg-purple-100'
                              }`}>
                                {user.role === 'USER' ? 
                                  <User className="h-5 w-5 text-green-600" /> : 
                                  <Building className="h-5 w-5 text-purple-600" />
                                }
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {user.role === 'USER' 
                                    ? user.name
                                    : user.companyProfile?.companyName || user.name
                                  }
                                </h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="text-sm"><strong>Role:</strong> {user.role}</p>
                                <p className="text-sm"><strong>Status:</strong> 
                                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                    user.isVerified ? getStatusColor('approved') : getStatusColor('pending')
                                  }`}>
                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                  </span>
                                </p>
                                {user.role === 'EMPLOYER' && (
                                  <p className="text-sm"><strong>Approved:</strong> 
                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                      user.isApproved ? getStatusColor('approved') : getStatusColor('pending')
                                    }`}>
                                      {user.isApproved ? 'Yes' : 'Pending'}
                                    </span>
                                  </p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                                {user.role === 'USER' && (
                                  <p className="text-sm"><strong>Applications:</strong> {user.applications?.length || 0}</p>
                                )}
                                {user.role === 'EMPLOYER' && (
                                  <p className="text-sm"><strong>Jobs Posted:</strong> {user.jobsPosted?.length || 0}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="w-full sm:w-auto"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">User Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Role:</strong> {selectedUser.role}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedUser.isVerified ? getStatusColor('approved') : getStatusColor('pending')
                      }`}>
                        {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </p>
                    <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedUser.role === 'USER' && selectedUser.userProfile && (
                  <div>
                    <h3 className="font-medium mb-2">Profile Information</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      {selectedUser.userProfile.phone && <p><strong>Phone:</strong> {selectedUser.userProfile.phone}</p>}
                      {selectedUser.userProfile.location && <p><strong>Location:</strong> {selectedUser.userProfile.location}</p>}
                      {selectedUser.userProfile.experience && <p><strong>Experience:</strong> <span className="whitespace-pre-wrap">{stripHtmlTags(selectedUser.userProfile.experience)}</span></p>}
                      {selectedUser.userProfile.education && <p><strong>Education:</strong> {selectedUser.userProfile.education}</p>}                      {selectedUser.userProfile.bio && (
                        <div>
                          <p><strong>Bio:</strong></p>
                          <p className="text-gray-600 mt-1 whitespace-pre-wrap">{stripHtmlTags(selectedUser.userProfile.bio)}</p>
                        </div>
                      )}{selectedUser.userProfile.skills && (
                        <div>
                          <p><strong>Skills:</strong></p>
                          <p className="text-gray-600 mt-1 whitespace-pre-wrap">{stripHtmlTags(selectedUser.userProfile.skills)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedUser.role === 'EMPLOYER' && selectedUser.companyProfile && (
                  <div>
                    <h3 className="font-medium mb-2">Company Information</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>Company:</strong> {selectedUser.companyProfile.companyName}</p>
                      {selectedUser.companyProfile.industry && <p><strong>Industry:</strong> {selectedUser.companyProfile.industry}</p>}
                      {selectedUser.companyProfile.companySize && <p><strong>Size:</strong> {selectedUser.companyProfile.companySize}</p>}
                      {selectedUser.companyProfile.location && <p><strong>Location:</strong> {selectedUser.companyProfile.location}</p>}
                      {selectedUser.companyProfile.website && (
                        <p><strong>Website:</strong> 
                          <a href={selectedUser.companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                            {selectedUser.companyProfile.website}
                          </a>
                        </p>
                      )}
                      {selectedUser.companyProfile.description && (
                        <div>
                          <p><strong>Description:</strong></p>
                          <p className="text-gray-600 mt-1">{selectedUser.companyProfile.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedUser.applications && selectedUser.applications.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Applications ({selectedUser.applications.length})</h3>
                    <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                      {selectedUser.applications.map((app, index) => (
                        <div key={app.id} className="py-1 border-b last:border-b-0">
                          <p className="text-sm">{app.job.title} - <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(app.status.toLowerCase())}`}>{app.status}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.jobsPosted && selectedUser.jobsPosted.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Posted Jobs ({selectedUser.jobsPosted.length})</h3>
                    <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                      {selectedUser.jobsPosted.map((job, index) => (
                        <div key={job.id} className="py-1 border-b last:border-b-0">
                          <p className="text-sm">{job.title} - <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(job.isActive ? 'active' : 'inactive')}`}>{job.isActive ? 'Active' : 'Inactive'}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employer Details Modal */}
      {showEmployerModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Employer Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEmployerModal(false);
                    setSelectedEmployer(null);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><strong>Contact Name:</strong> {selectedEmployer.name}</p>
                    <p><strong>Email:</strong> {selectedEmployer.email}</p>
                    <p><strong>Verified:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedEmployer.isVerified ? getStatusColor('approved') : getStatusColor('pending')
                      }`}>
                        {selectedEmployer.isVerified ? 'Yes' : 'No'}
                      </span>
                    </p>
                    <p><strong>Registration Date:</strong> {new Date(selectedEmployer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Company Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><strong>Company Name:</strong> {selectedEmployer.companyProfile?.companyName || 'Not provided'}</p>
                    <p><strong>Industry:</strong> {selectedEmployer.companyProfile?.industry || 'Not specified'}</p>
                    <p><strong>Company Size:</strong> {selectedEmployer.companyProfile?.companySize || 'Not specified'}</p>
                    <p><strong>Location:</strong> {selectedEmployer.companyProfile?.location || 'Not specified'}</p>
                    {selectedEmployer.companyProfile?.website && (
                      <p><strong>Website:</strong> 
                        <a href={selectedEmployer.companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          {selectedEmployer.companyProfile.website}
                          <ExternalLink className="h-3 w-3 inline ml-1" />
                        </a>
                      </p>
                    )}
                    {selectedEmployer.companyProfile?.description && (
                      <div className="mt-2">
                        <p><strong>Description:</strong></p>
                        <p className="text-gray-600 mt-1">{selectedEmployer.companyProfile.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEmployer.jobsPosted && selectedEmployer.jobsPosted.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Posted Jobs ({selectedEmployer.jobsPosted.length})</h3>
                    <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
                      {selectedEmployer.jobsPosted.map((job) => (
                        <div key={job.id} className="py-2 border-b last:border-b-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                            <p className="text-sm font-medium">{job.title}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                job.isActive ? getStatusColor('active') : getStatusColor('inactive')
                              }`}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApproveReject(selectedEmployer.id, 'approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Employer
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproveReject(selectedEmployer.id, 'reject')}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Employer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
