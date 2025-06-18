import { UserPlus, Search, Send, CheckCircle } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and build a comprehensive profile that showcases your skills, experience, and career goals.',
      color: 'bg-blue-600'
    },
    {
      number: 2,
      icon: Search,
      title: 'Search & Discover',
      description: 'Browse thousands of jobs or let our AI recommend positions that match your interests and qualifications.',
      color: 'bg-purple-600'
    },
    {
      number: 3,
      icon: Send,
      title: 'Apply with Confidence',
      description: 'Submit applications with one click using your profile, or customize your application for specific roles.',
      color: 'bg-green-600'
    },
    {
      number: 4,
      icon: CheckCircle,
      title: 'Get Hired',
      description: 'Connect with employers, ace your interviews, and land your dream job with our support throughout the process.',
      color: 'bg-orange-600'
    },
  ];
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 transform rotate-12 scale-150"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-200 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-2 bg-gradient-to-r from-blue-300 to-purple-300 opacity-30 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started in four simple steps and find your perfect job match
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              {/* Step Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10">
                {/* Step Number & Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Alternative for Employers */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              For Employers
            </h3>
            <p className="text-lg text-gray-600">
              Post jobs, find talent, and build your dream team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Post Your Job</h4>
              <p className="text-gray-600 text-sm">Create detailed job listings with requirements and benefits</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Review Applications</h4>
              <p className="text-gray-600 text-sm">Screen candidates with AI-powered matching and filtering</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Hire the Best</h4>
              <p className="text-gray-600 text-sm">Connect with top talent and grow your team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
