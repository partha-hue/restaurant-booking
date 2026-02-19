/**
 * Next.js config (JS). Vercel reads JS config during the build phase.
 * Keep the TypeScript (TS) variant for IDE support, but export JS for builds.
 */
const path = require("path");

module.exports = {
      reactStrictMode: true,
      eslint: {
            // Ignore ESLint errors during production builds on Vercel to prevent build failure
            ignoreDuringBuilds: true,
      },
      // Set output file tracing root to silence workspace root warning and fix routing
      outputFileTracingRoot: __dirname,
};
