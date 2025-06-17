import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Building, ArrowRight, Search, Briefcase } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Dream Job
            </span>
            <br className="hidden sm:block" />
            <span className="block sm:inline"> Today</span>
          </h1>
          
          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
            Connect with top companies and discover opportunities that match your skills. 
            Your next career move is just a click away.
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0 mb-8 sm:mb-12">
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            
            <div className="hidden sm:block text-gray-400 text-lg font-medium">or</div>
            
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <Users className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>          </div>
          
          {/* Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto px-4 sm:px-0">
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">1000+</div>
              <div className="text-sm sm:text-base text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">500+</div>
              <div className="text-sm sm:text-base text-gray-600">Companies</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">10k+</div>
              <div className="text-sm sm:text-base text-gray-600">Job Seekers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
