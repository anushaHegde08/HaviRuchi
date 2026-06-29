import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ← for Google profile images
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
};

export default nextConfig;
