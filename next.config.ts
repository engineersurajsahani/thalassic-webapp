import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "astra-crew.com",
      },
      {
        protocol: "https",
        hostname: "www.marinepublic.com",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "k.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
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
