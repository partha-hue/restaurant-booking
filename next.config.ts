import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds on the host (e.g., Vercel)
    // This prevents the build from failing due to linter rules while still
    // keeping ESLint available during development.
    ignoreDuringBuilds: true,
  },
  // If your repository contains multiple lockfiles, Next may infer the wrong
  // workspace root. Setting outputFileTracingRoot can silence that warning
  // and ensure tracing uses the correct directory if needed.
  // outputFileTracingRoot: __dirname,
};

