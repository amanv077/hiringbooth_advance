'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  variant?: 'default' | 'transparent';
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const baseClasses = variant === 'transparent' 
    ? 'bg-transparent absolute w-full z-50' 
    : 'bg-white shadow-sm';

  const textClasses = variant === 'transparent' 
    ? 'text-white hover:text-blue-200' 
    : 'text-gray-700 hover:text-blue-600';

  const logoClasses = variant === 'transparent' 
    ? 'text-white' 
    : 'text-blue-600';

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
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden ${variant === 'transparent' ? 'bg-blue-600/95 backdrop-blur-sm' : 'bg-white border-t'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
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
              <div className="pt-4 pb-2 space-y-2">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
