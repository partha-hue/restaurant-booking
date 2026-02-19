/**
 * Next.js config (JS) — Next reads JS config during builds. Keep the TypeScript
 * variant for editor support, but export a JS version so the build respects
 * `eslint.ignoreDuringBuilds` on hosts like Vercel.
 */
module.exports = {
      eslint: {
            // Prevent linter errors from failing production builds (e.g., on Vercel).
            ignoreDuringBuilds: true,
      },
      // If needed, you can uncomment and set this to silence workspace root warnings:
      // outputFileTracingRoot: __dirname,
};
