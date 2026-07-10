import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/seafarer/:path*',
        destination: '/seafearer/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
