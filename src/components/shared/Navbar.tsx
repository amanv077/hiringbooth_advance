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
  };  return (    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200 shadow-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                HiringBooth
              </span>
            </Link>
          </div>          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-2">
              {!user && (
                <Link
                  href="/"
                  className={`px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive("/")
                      ? "text-blue-600 bg-blue-50 shadow-md"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                  }`}
                >
                  Home
                </Link>
              )}
              <Link
                href="/jobs"
                className={`px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                  isActive("/jobs")
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                }`}
              >
                Jobs
              </Link>
              <Link
                href="/about"
                className={`px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                  isActive("/about")
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                }`}
              >
                About
              </Link>
              <Link
                href="/careers"
                className={`px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                  isActive("/careers")
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                }`}
              >
                Careers
              </Link>
              <Link
                href="/contact"
                className={`px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                  isActive("/contact")
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                }`}
              >
                Contact
              </Link>
              {(user?.role === "EMPLOYER" || user?.role === "employer") && (
                <Link
                  href="/employer/jobs/create"
                  className={`px-5 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive("/employer/jobs/create")
                      ? "text-blue-600 bg-blue-50 shadow-md"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm"
                  }`}
                >
                  Post Job
                </Link>
              )}
            </div></div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  href={getProfileLink()}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="px-5 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    size="sm"
                    className="px-6 py-2 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">          <div className="px-6 py-6 space-y-4">
            {!user && (
              <Link
                href="/"
                onClick={closeMenu}
                className={`block text-base font-semibold py-3 px-5 rounded-lg transition-all duration-300 ${
                  isActive("/")
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Home
              </Link>
            )}
            <Link
              href="/jobs"
              onClick={closeMenu}
              className={`block text-base font-semibold py-3 px-5 rounded-lg transition-all duration-300 ${
                isActive("/jobs")
                  ? "text-blue-600 bg-blue-50 shadow-md"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Jobs
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className={`block text-base font-semibold py-3 px-5 rounded-lg transition-all duration-300 ${
                isActive("/about")
                  ? "text-blue-600 bg-blue-50 shadow-md"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              About
            </Link>
            <Link
              href="/careers"
              onClick={closeMenu}
              className={`block text-base font-semibold py-3 px-5 rounded-lg transition-all duration-300 ${
                isActive("/careers")
                  ? "text-blue-600 bg-blue-50 shadow-md"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Careers
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`block text-base font-semibold py-3 px-5 rounded-lg transition-all duration-300 ${
                isActive("/contact")
                  ? "text-blue-600 bg-blue-50 shadow-md"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Contact
            </Link>
            {(user?.role === "EMPLOYER" || user?.role === "employer") && (
              <Link
                href="/employer/jobs/create"
                onClick={closeMenu}
                className={`block text-base font-semibold py-3 px-5 rounded-lg transition-all duration-300 ${
                  isActive("/employer/jobs/create")
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Post Job
              </Link>
            )}            {/* Mobile Auth */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <Link
                    href={getDashboardLink()}
                    onClick={closeMenu}
                    className="block text-base font-medium py-3 px-5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={getProfileLink()}
                    onClick={closeMenu}
                    className="block text-base font-medium py-3 px-5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full text-left text-base font-medium py-3 px-5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block text-base font-medium py-3 px-5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="block text-base font-medium py-3 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-center shadow-md"
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
