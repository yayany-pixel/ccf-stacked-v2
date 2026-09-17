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
  // Redirects for old/expired event URLs
  async redirects() {
    return [
      {
        source: '/events/eventbrite-1981076370754-eugene-date-night-pottery',
        destination: 'https://colorcocktailfactory.as.me/',
        permanent: true,
      },
      // Catch-all for other old eventbrite event URLs
      {
        source: '/events/eventbrite-:id(\\d+)-:slug*',
        destination: 'https://colorcocktailfactory.as.me/',
        permanent: false,
      },
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
