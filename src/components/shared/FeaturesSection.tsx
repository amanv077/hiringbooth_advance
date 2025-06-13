import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, Building, CheckCircle, Zap, Shield, Brain, Clock } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: 'Smart Job Search',
      description: 'Find the perfect job with our advanced search filters and AI-powered recommendations tailored to your skills.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Users,
      title: 'Talent Pool',
      description: 'Access a diverse pool of qualified candidates ready to take their next career step with verified profiles.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Building,
      title: 'Company Profiles',
      description: 'Detailed company profiles help candidates learn about culture, benefits, and growth opportunities.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Verified Employers',
      description: 'All employers are verified to ensure legitimate job opportunities and safe application processes.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Brain,
      title: 'AI Matching',
      description: 'Our intelligent matching algorithm connects the right candidates with the right opportunities.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get real-time alerts for new job postings and application updates that match your preferences.',
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy measures.',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you navigate your job search or hiring process.',
      color: 'bg-indigo-50 text-indigo-600'
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose HiringBooth?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've built the most comprehensive platform to connect job seekers and employers with cutting-edge features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
