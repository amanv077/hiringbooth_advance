import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';
import { Navbar, Footer } from '@/components/shared';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About HiringBooth
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the way companies find talent and candidates discover opportunities. 
              Our platform connects the right people with the right jobs, creating meaningful career journeys.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At HiringBooth, we believe that finding the perfect job or the ideal candidate shouldn't be a 
                matter of chance. We're dedicated to creating a seamless, efficient, and transparent hiring 
                process that benefits both employers and job seekers.
              </p>
              <p className="text-lg text-gray-600">
                Our platform leverages cutting-edge technology and data-driven insights to match skills 
                with opportunities, ensuring that every connection made has the potential to create lasting success.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">5K+</h3>
                  <p className="text-gray-600">Jobs Posted</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">98%</h3>
                  <p className="text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">1K+</h3>
                  <p className="text-gray-600">Happy Hires</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">People First</h3>
              <p className="text-gray-600">
                We put people at the center of everything we do, ensuring that both employers and 
                job seekers have the best possible experience on our platform.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to improve our platform, using the latest technology 
                to make hiring faster, smarter, and more effective.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrity</h3>
              <p className="text-gray-600">
                We maintain the highest standards of honesty and transparency in all our 
                interactions, building trust with every connection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-xl text-gray-600">
              The passionate individuals behind HiringBooth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900">Sarah Johnson</h3>
              <p className="text-blue-600 mb-2">CEO & Founder</p>
              <p className="text-gray-600 text-sm">
                With 15+ years in HR technology, Sarah leads our vision to transform hiring.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900">Michael Chen</h3>
              <p className="text-blue-600 mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Tech visionary with expertise in AI and machine learning for recruitment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900">Emily Rodriguez</h3>
              <p className="text-blue-600 mb-2">Head of Product</p>
              <p className="text-gray-600 text-sm">
                Product strategist focused on creating intuitive user experiences.
              </p>
            </div>          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
