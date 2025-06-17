'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    profile?: {
      companyName?: string;
    };
    email: string;
    isApproved: boolean;
  };
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              HiringBooth
            </Link>
            <span className="hidden sm:inline-block ml-4 text-gray-600">Employer Dashboard</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-700 truncate max-w-48">
              Welcome, {user.profile?.companyName || user.email}!
            </span>
            {!user.isApproved && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Pending Approval
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/employer/profile-setup')}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <div className="text-sm text-gray-700 px-2">
              Welcome, {user.profile?.companyName || user.email}!
            </div>
            {!user.isApproved && (
              <div className="px-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Pending Approval
                </span>
              </div>
            )}
            <div className="flex flex-col space-y-2 px-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  router.push('/employer/profile-setup');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
