import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Building, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Dream Job or
            <br />
            <span className="text-blue-600 relative">
              Perfect Candidate
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-200 rounded-full transform rotate-1"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            HiringBooth connects talented professionals with forward-thinking companies. 
            Whether you're looking for your next opportunity or building your dream team, we're here to help.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth/register?role=user">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto">
                <Users className="h-6 w-6 mr-3" />
                I'm Looking for a Job
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <div className="hidden sm:block text-gray-400 text-lg font-medium">or</div>
            
            <Link href="/auth/register?role=employer">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-4 h-auto"
              >
                <Building className="h-6 w-6 mr-3" />
                I'm Hiring Talent
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>100% Free for Job Seekers</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Verified Companies Only</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>AI-Powered Matching</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
