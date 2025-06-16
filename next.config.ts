import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript errors during build for Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors during build for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Additional optimizations
  swcMinify: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
