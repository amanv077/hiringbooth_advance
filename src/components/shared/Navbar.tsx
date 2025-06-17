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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Briefcase className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                <div className="absolute -inset-1 bg-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HiringBooth
              </span>
            </Link>
          </div>          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {!user && (
                <Link
                  href="/"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/")
                      ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-600/25"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Home
                </Link>
              )}
              <Link
                href="/jobs"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/jobs")
                    ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-600/25"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Browse Jobs
              </Link>
              {(user?.role === "EMPLOYER" || user?.role === "employer") && (
                <Link
                  href="/employer/jobs/create"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/employer/jobs/create")
                      ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-600/25"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Post Job
                </Link>
              )}
            </div>
          </div>          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Dashboard
                </Link>
                <Link
                  href={getProfileLink()}
                  className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="cursor-pointer px-6 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    size="sm" 
                    className="cursor-pointer px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-white to-gray-50">
            {!user && (
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
            )}            <Link
              href="/jobs"
              onClick={closeMenu}
              className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                isActive("/jobs")
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Browse Jobs
            </Link>
            {(user?.role === "EMPLOYER" || user?.role === "employer") && (
              <Link
                href="/employer/jobs/create"
                onClick={closeMenu}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive("/employer/jobs/create")
                    ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Post Job
              </Link>
            )}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <Link
                    href={getDashboardLink()}
                    onClick={closeMenu}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href={getProfileLink()}
                    onClick={closeMenu}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
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
