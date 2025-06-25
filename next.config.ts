import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Agar tu yeh rakhna chahta hai to
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
