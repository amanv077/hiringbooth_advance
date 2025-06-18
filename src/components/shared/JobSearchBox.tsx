'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

interface JobSearchBoxProps {
  className?: string;
  showPopularCategories?: boolean;
}

export function JobSearchBox({ className = '', showPopularCategories = true }: JobSearchBoxProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create search params
    const searchParams = new URLSearchParams();
    if (jobTitle.trim()) {
      searchParams.set('title', jobTitle.trim());
    }
    if (location.trim()) {
      searchParams.set('location', location.trim());
    }
    
    // Navigate to jobs page with search parameters
    const searchQuery = searchParams.toString();
    router.push(`/jobs${searchQuery ? `?${searchQuery}` : ''}`);
  };

  const handleCategoryClick = (category: string) => {
    setJobTitle(category);
    const searchParams = new URLSearchParams();
    searchParams.set('title', category);
    router.push(`/jobs?${searchParams.toString()}`);
  };

  const popularCategories = ['Technology', 'Marketing', 'Design', 'Sales', 'Finance', 'Healthcare'];

  return (
    <div className={`relative ${className}`}>
      {/* Background Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl">
        {/* Job Search Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Job Search</h3>
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Job title or keyword"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Location (City, State, or Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search Jobs
            </button>
          </form>
        </div>
        
        {/* Popular Categories */}
        {showPopularCategories && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="px-3 py-1 bg-white/60 text-gray-700 rounded-full text-sm font-medium hover:bg-white/80 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>        )}
      </div>
    </div>
  );
}
