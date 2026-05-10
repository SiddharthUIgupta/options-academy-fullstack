import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/options-academy',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
