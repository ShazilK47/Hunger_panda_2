import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com"], // Allow images from Unsplash
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any secure URL in production
      },
    ],
  },
};

export default nextConfig;
