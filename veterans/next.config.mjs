import withPreconstruct from '@preconstruct/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
  // Disable static generation for auth-related pages
  output: 'standalone',
  // Add rewrites for auth routes
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/login',
      },
      {
        source: '/register',
        destination: '/register',
      },
      {
        source: '/',
        destination: '/',
      },
      {
        source: '/GoogleOauth/Code',
        destination: '/api/auth/callback/google',
      },
      {
        source: '/api/auth/callback/google',
        destination: '/api/auth/callback/google',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
      };
    }
    return config;
  },
};

export default withPreconstruct(nextConfig);
