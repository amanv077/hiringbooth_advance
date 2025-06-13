import { Briefcase, Building, Users, CheckCircle, TrendingUp, Globe } from 'lucide-react';

export function StatsSection() {
  const stats = [
    { 
      label: 'Active Jobs', 
      value: '10,000+', 
      icon: Briefcase,
      description: 'Live job postings updated daily'
    },
    { 
      label: 'Companies', 
      value: '2,500+', 
      icon: Building,
      description: 'Verified employers worldwide'
    },
    { 
      label: 'Job Seekers', 
      value: '50,000+', 
      icon: Users,
      description: 'Active professionals seeking opportunities'
    },
    { 
      label: 'Success Stories', 
      value: '15,000+', 
      icon: CheckCircle,
      description: 'Successful job placements this year'
    },
    { 
      label: 'Growth Rate', 
      value: '300%', 
      icon: TrendingUp,
      description: 'Year-over-year platform growth'
    },
    { 
      label: 'Countries', 
      value: '25+', 
      icon: Globe,
      description: 'Global reach across continents'
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform has become the go-to destination for both job seekers and employers
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500 leading-relaxed">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
