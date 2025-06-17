'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, Bell } from 'lucide-react';
import Link from 'next/link';

interface EmployerHeaderProps {
  user: any;
  onLogout: () => void;
  onProfileClick: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function EmployerHeader({ 
  user, 
  onLogout, 
  onProfileClick, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: EmployerHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              HiringBooth
            </Link>
            <span className="hidden sm:block ml-4 text-gray-600">Employer Dashboard</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Info */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.profile?.companyName || user.email}
              </div>
              {!user.isApproved && (
                <div className="text-xs text-yellow-600">Pending Approval</div>
              )}
            </div>

            {/* Action Buttons */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onProfileClick}
              className="flex items-center"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="text-base font-medium text-gray-900">
                  {user.profile?.companyName || user.email}
                </div>
                {!user.isApproved && (
                  <div className="text-sm text-yellow-600">Pending Approval</div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <Button 
                variant="ghost" 
                onClick={onProfileClick}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="w-full justify-start"
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
