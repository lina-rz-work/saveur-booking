/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ESLint запускается отдельным шагом в CI, поэтому не дублируем его в build.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
