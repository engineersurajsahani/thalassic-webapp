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
  // ISSUE-005: Content Security Policy headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:4000 https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
          // ISSUE-069: Additional security headers (also set in backend)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // ISSUE-067: HSTS for HTTPS enforcement in production
          ...(process.env.NODE_ENV === 'production' ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains",
            },
          ] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
