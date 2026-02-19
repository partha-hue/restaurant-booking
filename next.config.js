/** @type {import('next').NextImage} */
const nextConfig = {
  reactStrictMode: true,
  // This is critical: ensure Next.js ignores the Android 'app' directory
  // by using the standard 'src' directory only.
  distDir: '.next',
};

module.exports = nextConfig;
