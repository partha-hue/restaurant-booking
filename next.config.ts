import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint errors during production builds on Vercel to prevent build failure
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
