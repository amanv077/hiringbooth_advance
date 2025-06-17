'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Briefcase, Settings, Home } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);
  const fetchUserProfile = async (token: string) => {
    try {
      // Try user profile first
      let response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Use the actual role from API
        setIsLoading(false);
        return;
      }

      // Try employer profile
      response = await fetch('/api/employer/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.employer); // Use the actual role from API
        setIsLoading(false);
        return;
      }

      // If both fail, remove token
      localStorage.removeItem('authToken');
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'EMPLOYER' || user.role === 'employer') return '/employer/dashboard';
    return '/user/dashboard';
  };

  const getProfileLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/profile';
    if (user.role === 'EMPLOYER' || user.role === 'employer') return '/employer/profile-setup';
    return '/user/profile-setup';
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">
                HiringBooth
              </span>
            </Link>
          </div>          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!user && (
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Home
                </Link>
              )}
              <Link
                href="/jobs"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/jobs")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Browse Jobs
              </Link>
              {(user?.role === "EMPLOYER" || user?.role === "employer") && (
                <Link
                  href="/employer/jobs/create"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/employer/jobs/create")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Post Job
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : user ? (              <div className="flex items-center space-x-4">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  href={getProfileLink()}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className=" cursor-pointer">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className=" cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {!user && (
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            )}
            <Link
              href="/jobs"
              onClick={closeMenu}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/jobs")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Link>
            {(user?.role === "EMPLOYER" || user?.role === "employer") && (
              <Link
                href="/employer/jobs/create"
                onClick={closeMenu}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/employer/jobs/create")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Post Job
              </Link>
            )}

            {/* Mobile Auth Section */}
            <div className="border-t pt-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : user ? (                <div className="space-y-1">
                  <Link
                    href={getDashboardLink()}
                    onClick={closeMenu}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href={getProfileLink()}
                    onClick={closeMenu}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
