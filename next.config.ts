import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint errors during production builds on Vercel to prevent build failure
    ignoreDuringBuilds: true,
  },
  // Set output file tracing root to silence workspace root warning
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
