import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/seafearer/sea-service-log',
        destination: '/seafearer/profile?tab=sea-service',
        permanent: false,
      },
      {
        source: '/seafarer/sea-service-log',
        destination: '/seafearer/profile?tab=sea-service',
        permanent: false,
      },
      {
        source: '/seafearer/vessel-sign-on-logs',
        destination: '/seafearer/profile?tab=sea-service',
        permanent: false,
      },
      {
        source: '/seafarer/vessel-sign-on-logs',
        destination: '/seafearer/profile?tab=sea-service',
        permanent: false,
      },
      {
        source: '/seafarer/:path*',
        destination: '/seafearer/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
