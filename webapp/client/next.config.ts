import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/options-academy-fullstack',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
