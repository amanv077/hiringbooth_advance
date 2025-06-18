import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Search } from 'lucide-react';
import { JobSearchBox } from './JobSearchBox';

export function HeroSection() {
  return (
    <section className="bg-white pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Find your next</span>
                <span className="block text-blue-600">dream job</span>
              </h1>
              
              <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                Connect with top employers, discover exciting opportunities, and take the next step in your career journey.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/jobs">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Find Jobs
                  </Button>
                </Link>
                
                <Link href="/auth/register">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-8 py-3 font-semibold"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-gray-900">15K+</div>
                  <div className="text-sm text-gray-600">Active Jobs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2K+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Professionals</div>
                </div>
              </div>
            </div>
          </div>            {/* Right Column - Visual */}
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <JobSearchBox className="mx-4 sm:mx-8 lg:mx-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
