'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HiringLoader } from '@/components/ui/loader';
import { Navbar, Footer } from '@/components/shared';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  X,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Utility functions
const parseSkills = (skillsJson?: string) => {
  if (!skillsJson) return [];
  try {
    return JSON.parse(skillsJson);
  } catch {
    return [];
  }
};

const stripHtmlTags = (html?: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

interface UserProfile {
  id: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string;
  experience?: string;
  education?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userProfile?: UserProfile;
  applications?: Array<{
    id: string;
    createdAt: string;
    job?: {
      id: string;
      title: string;
      employmentType: string;
      location?: string;
      employer?: {
        name: string;
        companyProfile?: {
          companyName?: string;
        };
      };
    };
  }>;
  _count?: {
    applications: number;
  };
}

// User Detail Modal Component
interface UserDetailModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: UserData) => void;
  onDelete: () => void;
}

function UserDetailModal({ user, isOpen, onClose, onUpdate, onDelete }: UserDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    phone: user.userProfile?.phone || '',
    location: stripHtmlTags(user.userProfile?.location) || '',
    bio: stripHtmlTags(user.userProfile?.bio) || '',
    education: stripHtmlTags(user.userProfile?.education) || '',
    experience: stripHtmlTags(user.userProfile?.experience) || '',
    skills: user.userProfile?.skills || '',
    linkedinUrl: user.userProfile?.linkedinUrl || '',
    githubUrl: user.userProfile?.githubUrl || '',
    portfolioUrl: user.userProfile?.portfolioUrl || '',
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      phone: user.userProfile?.phone || '',
      location: stripHtmlTags(user.userProfile?.location) || '',
      bio: stripHtmlTags(user.userProfile?.bio) || '',
      education: stripHtmlTags(user.userProfile?.education) || '',
      experience: stripHtmlTags(user.userProfile?.experience) || '',
      skills: user.userProfile?.skills || '',
      linkedinUrl: user.userProfile?.linkedinUrl || '',
      githubUrl: user.userProfile?.githubUrl || '',
      portfolioUrl: user.userProfile?.portfolioUrl || '',
    });
  }, [user]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/user-data/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            name: formData.name,
            email: formData.email,
            isVerified: formData.isVerified,
          },
          profile: {
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            education: formData.education,
            experience: formData.experience,
            skills: formData.skills,
            linkedinUrl: formData.linkedinUrl,
            githubUrl: formData.githubUrl,
            portfolioUrl: formData.portfolioUrl,
          },
        }),
      });

      if (response.ok) {
        const { user: updatedUser } = await response.json();
        onUpdate(updatedUser);
        setIsEditing(false);
        toast.success('User updated successfully');
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/user-data/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete();
        onClose();
        toast.success('User deleted successfully');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-6xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-6 w-6" />
              {isEditing ? 'Edit User' : 'User Details'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              User ID: {user.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? <HiringLoader size="sm" /> : <CheckCircle className="h-4 w-4" />}
                  Save Changes
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full name"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email address"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {user.userProfile?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Location"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {stripHtmlTags(user.userProfile?.location) || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.isVerified ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-700 font-medium">Verified Account</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-700 font-medium">Unverified Account</span>
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVerified}
                        onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Verified</span>
                    </label>
                  )}
                </div>                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="User bio"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{stripHtmlTags(user.userProfile?.bio) || 'No bio provided'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Education</label>
                    {isEditing ? (
                      <Input
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder="Education background"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {stripHtmlTags(user.userProfile?.education) || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
                    {isEditing ? (
                      <Input
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Years of experience"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {stripHtmlTags(user.userProfile?.experience) || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Skills</label>
                  {isEditing ? (
                    <textarea
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="Skills (JSON format)"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.userProfile?.skills ? (
                        parseSkills(user.userProfile.skills).map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills listed</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Links & URLs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Links & Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">LinkedIn</label>
                    {isEditing ? (
                      <Input
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="LinkedIn URL"
                      />
                    ) : (
                      user.userProfile?.linkedinUrl ? (
                        <a
                          href={user.userProfile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          LinkedIn Profile
                        </a>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">GitHub</label>
                    {isEditing ? (
                      <Input
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="GitHub URL"
                      />
                    ) : (
                      user.userProfile?.githubUrl ? (
                        <a
                          href={user.userProfile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          GitHub Profile
                        </a>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Portfolio</label>
                    {isEditing ? (
                      <Input
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="Portfolio URL"
                      />
                    ) : (
                      user.userProfile?.portfolioUrl ? (
                        <a
                          href={user.userProfile.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Portfolio
                        </a>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )
                    )}
                  </div>
                </div>

                {user.userProfile?.resumeUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Resume</label>
                    <a
                      href={user.userProfile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application History */}
            <Card>
              <CardHeader>                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Application History ({user._count?.applications || 0} applications)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.applications && user.applications.length > 0 ? (
                  <div className="space-y-3">
                    {user.applications.slice(0, 10).map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{application.job?.title || 'Unknown Job'}</h4>
                            <p className="text-sm text-gray-600">
                              {application.job?.employer?.companyProfile?.companyName || 
                               application.job?.employer?.name || 
                               'Unknown Company'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {application.job?.location || 'Location not specified'} • {application.job?.employmentType?.replace('_', ' ') || 'Unknown Type'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Applied on</p>
                            <p className="text-sm font-medium">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {user.applications.length > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... and {user.applications.length - 10} more applications
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No job applications found</p>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Registration Date</label>
                    <p className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Last Updated</label>
                    <p className="text-gray-900">
                      {new Date(user.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function UserDataPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, educationFilter, experienceFilter, locationFilter, skillsFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const params = new URLSearchParams();
      if (educationFilter) params.append('education', educationFilter);
      if (experienceFilter) params.append('experience', experienceFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (skillsFilter) params.append('skills', skillsFilter);

      const response = await fetch(`/api/admin/user-data?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Unauthorized access');
        router.push('/auth/login');
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userProfile?.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setEducationFilter('');
    setExperienceFilter('');
    setLocationFilter('');
    setSkillsFilter('');
    setShowFilters(false);
  };

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (educationFilter) params.append('education', educationFilter);
      if (experienceFilter) params.append('experience', experienceFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (skillsFilter) params.append('skills', skillsFilter);

      const response = await fetch(`/api/admin/user-data/export?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Data exported successfully');
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUpdateUser = (updatedUser: UserData) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(updatedUser);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <HiringLoader size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-8 w-8" />
                User Data Management
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExportData}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or bio..."
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
                  placeholder="Filter by location"
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value);
                    fetchUsers();
                  }}
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
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              disabled={!searchTerm && !educationFilter && !experienceFilter && !locationFilter && !skillsFilter}
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Education</label>
                <Input
                  placeholder="Filter by education"
                  value={educationFilter}
                  onChange={(e) => {
                    setEducationFilter(e.target.value);
                    fetchUsers();
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
                <Input
                  placeholder="Filter by experience"
                  value={experienceFilter}
                  onChange={(e) => {
                    setExperienceFilter(e.target.value);
                    fetchUsers();
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Skills</label>
                <Input
                  placeholder="Filter by skills"
                  value={skillsFilter}
                  onChange={(e) => {
                    setSkillsFilter(e.target.value);
                    fetchUsers();
                  }}
                />
              </div>
            </div>
          )}
        </div>        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 group relative"
              onClick={() => handleViewUser(user)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {user.name || 'Unknown User'}
                    </h3>
                    {user.isVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{user.email || 'No email'}</span>
                  </div>
                </div>                {/* Key Info */}
                <div className="space-y-1 mb-3">
                  {user.userProfile?.location && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{stripHtmlTags(user.userProfile.location)}</span>
                    </div>
                  )}
                  {user.userProfile?.experience && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Briefcase className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{stripHtmlTags(user.userProfile.experience)}</span>
                    </div>
                  )}
                  {user.userProfile?.education && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <GraduationCap className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{stripHtmlTags(user.userProfile.education)}</span>
                    </div>
                  )}
                </div>

                {/* Skills Preview */}
                {user.userProfile?.skills && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {parseSkills(user.userProfile.skills).slice(0, 2).map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded truncate">
                          {skill && skill.length > 10 ? skill.substring(0, 10) + '...' : skill}
                        </span>
                      ))}
                      {parseSkills(user.userProfile.skills).length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{parseSkills(user.userProfile.skills).length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {user._count?.applications || 0} apps
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-20 transition-opacity rounded-lg pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}

      <Footer />
    </div>
  );
}
