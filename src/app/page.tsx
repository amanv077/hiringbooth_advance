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
