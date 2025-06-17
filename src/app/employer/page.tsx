'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployerRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect appropriately
    const token = localStorage.getItem('authToken');
    if (token) {
      router.replace('/employer/dashboard');
    } else {
      router.replace('/auth/login?redirect=/employer/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
