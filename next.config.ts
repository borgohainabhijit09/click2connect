import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // Production URL (update after domain is connected)
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://click2connect.digital',
  },
};

export default nextConfig;
