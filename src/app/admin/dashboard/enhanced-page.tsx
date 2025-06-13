'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Building, Shield, CheckCircle, XCircle, Clock4, User, LogOut, Eye } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  userProfile?: {
    firstName: string;
    lastName: string;
    location?: string;
  };
  companyProfile?: {
    companyName: string;
    industry?: string;
    companySize?: string;
  };
  jobs?: Job[];
  applications?: any[];
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  company: {
    email: string;
    companyProfile: {
      companyName: string;
    };
  };
  _count: {
    applications: number;
  };
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchAdminData(token);
    fetchUsers(token);
    fetchJobs(token);
  }, [router]);

  const fetchAdminData = async (token: string) => {
    try {
      // For admin, we'll use the user profile endpoint to get basic info
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

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async (token: string) => {
    try {
      const response = await fetch('/api/admin/jobs', {
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

  const updateUserStatus = async (userId: string, isApproved?: boolean, isActive?: boolean) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const updateData: any = {};
      
      if (isApproved !== undefined) updateData.isApproved = isApproved;
      if (isActive !== undefined) updateData.isActive = isActive;

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('User status updated successfully!');
        fetchUsers(token!);
        setShowUserModal(false);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const totalUsers = users.length;
  const jobSeekers = users.filter(user => user.role === 'USER').length;
  const employers = users.filter(user => user.role === 'EMPLOYER').length;
  const pendingApprovals = users.filter(user => user.role === 'EMPLOYER' && !user.isApproved).length;

  if (!admin) {
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
              <span className="ml-4 text-gray-600">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Admin!</span>
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
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Job Seekers</p>
                  <p className="text-2xl font-bold text-gray-900">{jobSeekers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employers</p>
                  <p className="text-2xl font-bold text-gray-900">{employers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock4 className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
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
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approvals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Approvals
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(-5).reverse().map((user) => (
                    <div key={user.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.role === 'USER' 
                            ? `${user.userProfile?.firstName || ''} ${user.userProfile?.lastName || ''}`.trim() || user.email
                            : user.companyProfile?.companyName || user.email
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          New {user.role.toLowerCase()} registration
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'EMPLOYER' && !user.isApproved 
                          ? getStatusColor('pending')
                          : getStatusColor('approved')
                      }`}>
                        {user.role === 'EMPLOYER' && !user.isApproved ? 'Pending' : 'Active'}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No users registered yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Jobs:</span>
                      <span className="font-medium">{jobs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Jobs:</span>
                      <span className="font-medium">{jobs.filter(job => job.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Applications:</span>
                      <span className="font-medium">{jobs.reduce((sum, job) => sum + job._count.applications, 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Seekers:</span>
                      <span className="font-medium">{jobSeekers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employers:</span>
                      <span className="font-medium">{employers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified Users:</span>
                      <span className="font-medium">{users.filter(user => user.isVerified).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">All Users</h2>
            
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.role === 'USER' 
                              ? `${user.userProfile?.firstName || ''} ${user.userProfile?.lastName || ''}`.trim() || user.email
                              : user.companyProfile?.companyName || user.email
                            }
                          </h3>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'USER' ? 'text-blue-600 bg-blue-50' : 
                            user.role === 'EMPLOYER' ? 'text-purple-600 bg-purple-50' : 
                            'text-gray-600 bg-gray-50'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-2">Email: {user.email}</p>
                        
                        {user.role === 'EMPLOYER' && user.companyProfile && (
                          <div className="text-sm text-gray-600">
                            <p>Industry: {user.companyProfile.industry || 'Not specified'}</p>
                            <p>Company Size: {user.companyProfile.companySize || 'Not specified'}</p>
                            <p>Jobs Posted: {user.jobs?.length || 0}</p>
                          </div>
                        )}
                        
                        {user.role === 'USER' && user.userProfile && (
                          <div className="text-sm text-gray-600">
                            <p>Location: {user.userProfile.location || 'Not specified'}</p>
                            <p>Applications: {user.applications?.length || 0}</p>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="ml-6 flex items-center space-x-4">
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isVerified ? getStatusColor('active') : getStatusColor('inactive')
                          }`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                          
                          {user.role === 'EMPLOYER' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isApproved ? getStatusColor('approved') : getStatusColor('pending')
                            }`}>
                              {user.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          )}
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? getStatusColor('active') : getStatusColor('inactive')
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {users.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
                    <p className="text-gray-600">Users will appear here as they register</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">All Jobs</h2>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            job.isActive ? getStatusColor('active') : getStatusColor('inactive')
                          }`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          Company: {job.company.companyProfile?.companyName}
                        </p>
                        
                        <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>{job.location}</span>
                          <span>{job.type.replace('_', ' ')}</span>
                          <span>{job.category}</span>
                          <span>{job._count.applications} applications</span>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Posted: {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {jobs.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                    <p className="text-gray-600">Jobs will appear here as employers post them</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Pending Employer Approvals</h2>
            
            <div className="space-y-4">
              {users.filter(user => user.role === 'EMPLOYER' && !user.isApproved).map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {user.companyProfile?.companyName || user.email}
                        </h3>
                        
                        <p className="text-gray-600 mb-2">Email: {user.email}</p>
                        
                        {user.companyProfile && (
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Industry: {user.companyProfile.industry || 'Not specified'}</p>
                            <p>Company Size: {user.companyProfile.companySize || 'Not specified'}</p>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Registered: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="ml-6 flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => updateUserStatus(user.id, false)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => updateUserStatus(user.id, true)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {users.filter(user => user.role === 'EMPLOYER' && !user.isApproved).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                    <p className="text-gray-600">All employer accounts have been reviewed</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Management Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Manage User</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900">User Details</h4>
                <p>Email: {selectedUser.email}</p>
                <p>Role: {selectedUser.role}</p>
                <p>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              
              {selectedUser.companyProfile && (
                <div>
                  <h4 className="font-medium text-gray-900">Company Details</h4>
                  <p>Company: {selectedUser.companyProfile.companyName}</p>
                  <p>Industry: {selectedUser.companyProfile.industry || 'Not specified'}</p>
                  <p>Size: {selectedUser.companyProfile.companySize || 'Not specified'}</p>
                </div>
              )}
              
              {selectedUser.userProfile && (
                <div>
                  <h4 className="font-medium text-gray-900">Profile Details</h4>
                  <p>Name: {selectedUser.userProfile.firstName} {selectedUser.userProfile.lastName}</p>
                  <p>Location: {selectedUser.userProfile.location || 'Not specified'}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900">Current Status</h4>
                <div className="flex space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser.isVerified ? getStatusColor('active') : getStatusColor('inactive')
                  }`}>
                    {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  
                  {selectedUser.role === 'EMPLOYER' && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.isApproved ? getStatusColor('approved') : getStatusColor('pending')
                    }`}>
                      {selectedUser.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  )}
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser.isActive ? getStatusColor('active') : getStatusColor('inactive')
                  }`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
              >
                Close
              </Button>
              
              <div className="flex space-x-2">
                {selectedUser.role === 'EMPLOYER' && !selectedUser.isApproved && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => updateUserStatus(selectedUser.id, false)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => updateUserStatus(selectedUser.id, true)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => updateUserStatus(selectedUser.id, undefined, !selectedUser.isActive)}
                  disabled={isLoading}
                >
                  {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
