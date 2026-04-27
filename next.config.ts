import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent workspace-root mis-detection when parent folders also have lockfiles.
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "static.photos",
        pathname: "/people/**",
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
