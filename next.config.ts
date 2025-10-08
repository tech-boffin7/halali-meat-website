import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: 'https://halalimeatltd.com/$1',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        missing: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
