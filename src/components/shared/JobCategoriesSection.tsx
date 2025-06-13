import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Code, 
  Heart, 
  DollarSign, 
  GraduationCap, 
  Megaphone, 
  ShoppingBag, 
  Palette, 
  Wrench,
  TrendingUp,
  Users,
  Building,
  Truck
} from 'lucide-react';

export function JobCategoriesSection() {
  const jobCategories = [
    { name: 'Technology', icon: Code, count: '2,450+', color: 'bg-blue-50 text-blue-600' },
    { name: 'Healthcare', icon: Heart, count: '1,230+', color: 'bg-red-50 text-red-600' },
    { name: 'Finance', icon: DollarSign, count: '890+', color: 'bg-green-50 text-green-600' },
    { name: 'Education', icon: GraduationCap, count: '650+', color: 'bg-purple-50 text-purple-600' },
    { name: 'Marketing', icon: Megaphone, count: '780+', color: 'bg-orange-50 text-orange-600' },
    { name: 'Sales', icon: TrendingUp, count: '920+', color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Design', icon: Palette, count: '540+', color: 'bg-pink-50 text-pink-600' },
    { name: 'Engineering', icon: Wrench, count: '1,120+', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Retail', icon: ShoppingBag, count: '430+', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Human Resources', icon: Users, count: '320+', color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Construction', icon: Building, count: '410+', color: 'bg-stone-50 text-stone-600' },
    { name: 'Logistics', icon: Truck, count: '380+', color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Popular Job Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore opportunities across various industries and find your perfect career path
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {jobCategories.map((category, index) => (
            <Link key={index} href={`/jobs?category=${category.name.toLowerCase().replace(' ', '-')}`}>
              <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {category.count} jobs
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/jobs">
            <button className="inline-flex items-center px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
              View All Categories
              <Code className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
