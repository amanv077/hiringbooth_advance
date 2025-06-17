'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navbar,
  Footer,
  HeroSection,
  StatsSection,
  FeaturesSection,
  JobCategoriesSection,
  HowItWorksSection,
  CTASection,
} from '@/components/shared';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Check user role and redirect accordingly
          const response = await fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            
            // Redirect based on user role
            if (data.user.role === 'EMPLOYER') {
              router.push('/employer/dashboard');
              return;
            } else if (data.user.role === 'ADMIN') {
              router.push('/admin/dashboard');
              return;
            }
            // If USER role, stay on homepage
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          // If error, remove invalid token
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };

    checkUserAndRedirect();
  }, [router]);

  // Show loading state while checking user
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <JobCategoriesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
