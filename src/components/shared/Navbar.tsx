'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Briefcase, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  variant?: 'default' | 'transparent';
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'EMPLOYER':
        return '/employer/dashboard';
      case 'USER':
        return '/user/dashboard';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/profile';
      case 'EMPLOYER':
        return '/employer/profile-setup';
      case 'USER':
        return '/user/profile-setup';
      default:
        return '/';
    }
  };

  const baseClasses = variant === 'transparent' 
    ? 'bg-transparent absolute w-full z-50' 
    : 'bg-white shadow-sm';

  const textClasses = variant === 'transparent' 
    ? 'text-white hover:text-blue-200' 
    : 'text-gray-700 hover:text-blue-600';

  const logoClasses = variant === 'transparent' 
    ? 'text-white' 
    : 'text-blue-600';

  if (isLoading) {
    return (
      <header className={baseClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`text-2xl font-bold ${logoClasses}`}>
              HiringBooth
            </div>
            <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className={baseClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className={`text-2xl font-bold ${logoClasses}`}>
              HiringBooth
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <Link href="/jobs" className={textClasses}>
                  Find Jobs
                </Link>
                <Link href="/companies" className={textClasses}>
                  Companies
                </Link>
                <Link href="/about" className={textClasses}>
                  About
                </Link>
                <Link href="/contact" className={textClasses}>
                  Contact
                </Link>
              </>
            )}
            
            {user && user.role === 'USER' && (
              <>
                <Link href="/jobs" className={textClasses}>
                  Find Jobs
                </Link>
                <Link href="/user/applications" className={textClasses}>
                  My Applications
                </Link>
                <Link href="/companies" className={textClasses}>
                  Companies
                </Link>
              </>
            )}
            
            {user && user.role === 'EMPLOYER' && (
              <>
                <Link href="/employer/jobs/create" className={textClasses}>
                  Post Job
                </Link>
                <Link href="/employer/dashboard" className={textClasses}>
                  Dashboard
                </Link>
              </>
            )}
            
            {user && user.role === 'ADMIN' && (
              <>
                <Link href="/admin/dashboard" className={textClasses}>
                  Dashboard
                </Link>
                <Link href="/admin/users" className={textClasses}>
                  Users
                </Link>
                <Link href="/admin/jobs" className={textClasses}>
                  Jobs
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <Button 
                    variant={variant === 'transparent' ? 'outline' : 'outline'}
                    className={variant === 'transparent' ? 'border-white text-white hover:bg-white hover:text-blue-600' : ''}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className={variant === 'transparent' ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}>
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${textClasses}`}>
                  Welcome, {user.profile?.companyName || user.profile?.firstName || user.name}!
                </span>
                {user.role === 'EMPLOYER' && !user.isApproved && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending Approval
                  </span>
                )}
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm" className={textClasses}>
                    {user.role === 'ADMIN' ? <Settings className="h-4 w-4 mr-1" /> :
                     user.role === 'EMPLOYER' ? <Briefcase className="h-4 w-4 mr-1" /> :
                     <User className="h-4 w-4 mr-1" />}
                    Dashboard
                  </Button>
                </Link>
                <Link href={getProfileLink()}>
                  <Button variant="ghost" size="sm" className={textClasses}>
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className={textClasses}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={variant === 'transparent' ? 'text-white hover:bg-white/10' : ''}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden ${variant === 'transparent' ? 'bg-blue-600/95 backdrop-blur-sm' : 'bg-white border-t'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!user && (
                <>
                  <Link
                    href="/jobs"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>
                  <Link
                    href="/companies"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Companies
                  </Link>
                  <Link
                    href="/about"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}
              
              {user && user.role === 'USER' && (
                <>
                  <Link
                    href="/jobs"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>
                  <Link
                    href="/user/applications"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Applications
                  </Link>
                  <Link
                    href="/companies"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Companies
                  </Link>
                </>
              )}
              
              {user && user.role === 'EMPLOYER' && (
                <>
                  <Link
                    href="/employer/jobs/create"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post Job
                  </Link>
                  <Link
                    href="/employer/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              
              {user && user.role === 'ADMIN' && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/jobs"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${textClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Jobs
                  </Link>
                </>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 pb-2 space-y-2">
                {!user ? (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className={`w-full ${variant === 'transparent' ? 'border-white text-white hover:bg-white hover:text-blue-600' : ''}`}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className={`w-full ${variant === 'transparent' ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}`}>
                        Get Started
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className={`px-3 py-2 text-sm ${textClasses} border-b border-gray-200`}>
                      Welcome, {user.profile?.companyName || user.profile?.firstName || user.name}!
                      {user.role === 'EMPLOYER' && !user.isApproved && (
                        <span className="block text-yellow-600 text-xs mt-1">Pending Approval</span>
                      )}
                    </div>
                    <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {user.role === 'ADMIN' ? <Settings className="h-4 w-4 mr-2" /> :
                         user.role === 'EMPLOYER' ? <Briefcase className="h-4 w-4 mr-2" /> :
                         <User className="h-4 w-4 mr-2" />}
                        Dashboard
                      </Button>
                    </Link>
                    <Link href={getProfileLink()} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
