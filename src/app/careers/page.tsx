import React from 'react';
import Link from 'next/link';
import { Briefcase, Users, TrendingUp, Heart, MapPin, Clock, IndianRupee } from 'lucide-react';
import { Navbar, Footer } from '@/components/shared';

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "New York, NY / Remote",
      type: "Full-time",
      salary: "₹12,00,000 - ₹16,00,000",
      description: "Join our frontend team to build beautiful, responsive user interfaces using React and TypeScript."
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      salary: "₹13,00,000 - ₹17,00,000",
      description: "Lead product strategy and roadmap for our core hiring platform features."
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "New York, NY / Remote",
      type: "Full-time",
      salary: "₹10,00,000 - ₹14,00,000",
      description: "Design intuitive user experiences that make hiring effortless for both employers and candidates."
    },
    {
      id: 4,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "₹11,00,000 - ₹15,00,000",
      description: "Build scalable APIs and microservices to power our hiring platform infrastructure."
    },
    {
      id: 5,
      title: "Data Scientist",
      department: "Data",
      location: "New York, NY",
      type: "Full-time",
      salary: "₹12,50,000 - ₹16,50,000",
      description: "Develop machine learning models to improve job matching and candidate recommendations."
    },
    {
      id: 6,
      title: "Marketing Manager",
      department: "Marketing",
      location: "New York, NY / Hybrid",
      type: "Full-time",
      salary: "₹9,00,000 - ₹12,00,000",
      description: "Drive growth through strategic marketing campaigns and brand partnerships."
    }
  ];

  const benefits = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, dental, vision, and wellness programs"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth Opportunities",
      description: "Learning stipend, conference attendance, and clear career progression paths"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Schedule",
      description: "Flexible working hours and remote work options"
    },
    {
      icon: <IndianRupee className="h-6 w-6" />,
      title: "Competitive Compensation",
      description: "Market-competitive salaries with equity participation"
    }
  ];
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Join Our Team
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Help us build the future of hiring. We're looking for passionate individuals who want to 
              make a real impact in connecting talent with opportunity.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>50+ Team Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Remote-First Culture</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Fast Growing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Work at HiringBooth?</h2>
            <p className="mt-4 text-xl text-gray-600">
              We're more than just a company - we're a community of innovators
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            <p className="mt-4 text-xl text-gray-600">
              Find your next opportunity with us
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {openPositions.map((position) => (
              <div key={position.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {position.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-4 w-4" />
                        <span>{position.salary}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{position.description}</p>
                  </div>
                  <div className="lg:ml-6">
                    <button className="w-full lg:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Culture */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Culture</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation-Driven</h3>
                    <p className="text-gray-600">We encourage experimentation and bold ideas that push the industry forward.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Collaborative Environment</h3>
                    <p className="text-gray-600">Cross-functional teams work together to solve complex challenges.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Work-Life Balance</h3>
                    <p className="text-gray-600">We believe great work comes from well-rested, happy team members.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Continuous Learning</h3>
                    <p className="text-gray-600">Regular training, mentorship programs, and conference opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">What Our Team Says</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-600 italic mb-2">
                    "HiringBooth has been the most supportive and innovative company I've ever worked for. 
                    The team truly cares about each other's growth."
                  </p>
                  <p className="text-sm text-gray-500">- Alex Chen, Senior Developer</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-600 italic mb-2">
                    "The remote-first culture here is amazing. I can work from anywhere while being 
                    part of an incredible team building something meaningful."
                  </p>
                  <p className="text-sm text-gray-500">- Maria Rodriguez, Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Hiring Process</h2>
            <p className="mt-4 text-xl text-gray-600">
              Transparent, fair, and designed to showcase your best self
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-gray-600">Submit your application and we'll review it within 48 hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Screen</h3>
              <p className="text-gray-600">A 30-minute call to get to know each other better.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical/Skills Assessment</h3>
              <p className="text-gray-600">Demonstrate your skills through practical exercises.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Interview</h3>
              <p className="text-gray-600">Meet your potential teammates and discuss the role in depth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
            <p className="text-xl mb-6 opacity-90">
              Don't see a role that fits? We're always looking for exceptional talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Send Us Your Resume
                </button>
              </Link>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                View All Positions
              </button>
            </div>          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
