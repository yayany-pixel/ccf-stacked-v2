/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify deploy URLs are build-time metadata and may be absent from the
  // Next.js function environment. Embed only these public origins, never keys.
  env: {
    CCF_SITE_ORIGIN: process.env.URL || 'https://colorcocktailfactory.com',
    CCF_DEPLOY_ORIGIN: process.env.DEPLOY_PRIME_URL || '',
    CCF_DEPLOY_PERMALINK: process.env.DEPLOY_URL || '',
  },
  // ESLint runs via `npm run lint`. Skipping during production build preserves
  // the project's prior behavior (no .eslintrc.json existed before) and avoids
  // failing on hundreds of pre-existing react/no-unescaped-entities errors
  // that are out of scope for the blog scaffolding work.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.evbuc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.evbuc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Preserve links from the former site with permanent, relevant destinations.
  async redirects() {
    return [
      { source: '/wheel-throwing', destination: '/activities/beginner-wheel', permanent: true },
      { source: '/datenight', destination: '/activities/date-night-wheel', permanent: true },
      { source: '/mosaics', destination: '/activities/mosaic', permanent: true },
      { source: '/bonsai-workshop', destination: '/activities/bonsai', permanent: true },
      { source: '/terrarium', destination: '/activities/terrarium', permanent: true },
      { source: '/candles', destination: '/activities/candle-making', permanent: true },
      { source: '/glass-blowing', destination: '/activities/glass-blowing', permanent: true },
      { source: '/general-1-4', destination: '/activities/glass-fusion', permanent: true },
      { source: '/general-clean-2', destination: '/book/chicago/paint-pottery', permanent: true },
      { source: '/general-1-2', destination: '/activities/handbuilding', permanent: true },
      { source: '/general-1-3', destination: '/activities', permanent: true },
      { source: '/general-8-1', destination: '/activities', permanent: true },
      { source: '/services-1', destination: '/activities', permanent: true },
      { source: '/blank', destination: '/activities', permanent: true },
      { source: '/blank-1', destination: '/activities', permanent: true },
      { source: '/contact-us', destination: '/private-events', permanent: true },
      { source: '/testimonials', destination: '/birthday-parties', permanent: true },
      { source: '/general-clean-3', destination: '/activities', permanent: true },
    ];
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
