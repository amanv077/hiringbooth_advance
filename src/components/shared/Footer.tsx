import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="text-2xl font-bold text-white">
                HiringBooth
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting talent with opportunity. Your dream job or perfect candidate is just a click away.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                    Press & News
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/employer/jobs/create" className="text-gray-400 hover:text-white transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/talent-search" className="text-gray-400 hover:text-white transition-colors">
                    Search Talent
                  </Link>
                </li>
                <li>
                  <Link href="/recruiting-solutions" className="text-gray-400 hover:text-white transition-colors">
                    Recruiting Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/employer-branding" className="text-gray-400 hover:text-white transition-colors">
                    Employer Branding
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>            {/* For Job Seekers */}
            <div>
              <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="text-gray-400 hover:text-white transition-colors">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/career-advice" className="text-gray-400 hover:text-white transition-colors">
                    Career Advice
                  </Link>
                </li>
                <li>
                  <Link href="/salary-guide" className="text-gray-400 hover:text-white transition-colors">
                    Salary Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resume-tips" className="text-gray-400 hover:text-white transition-colors">
                    Resume Tips
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support & Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
              
              {/* Contact Info */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-gray-400 text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@hiringbooth.com</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} HiringBooth. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link href="/careers" className="text-gray-400 hover:text-white text-sm transition-colors">
                Careers
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
