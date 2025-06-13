import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Building } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Join thousands of successful professionals
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Take the Next Step?
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of professionals who have found their perfect match through HiringBooth. 
            Your dream career or ideal candidate is just one click away.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link href="/auth/register?role=user">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-lg px-10 py-4 h-auto font-semibold shadow-xl"
            >
              <Users className="h-6 w-6 mr-3" />
              Start Job Searching
              <ArrowRight className="h-5 w-5 ml-3" />
            </Button>
          </Link>
          
          <Link href="/auth/register?role=employer">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-4 h-auto font-semibold"
            >
              <Building className="h-6 w-6 mr-3" />
              Post Your First Job
              <ArrowRight className="h-5 w-5 ml-3" />
            </Button>
          </Link>
        </div>
        
        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">15,000+</div>
            <div className="text-blue-200">Successful hires this year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">98%</div>
            <div className="text-blue-200">Customer satisfaction rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">24hrs</div>
            <div className="text-blue-200">Average response time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
