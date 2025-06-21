import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/dashboard/',
        permanent: true,
      },
    ]
  },
  /* config options here */
};

export default nextConfig;
