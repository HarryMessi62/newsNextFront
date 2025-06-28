import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['infocryptox.com', 'images.unsplash.com'],
  },
  experimental: {
    esmExternals: true,
  },
}

export default nextConfig;
