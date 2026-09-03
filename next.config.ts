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
        source: '/seafarer/:path*',
        destination: '/seafearer/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
