import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Static export for GitHub Pages
  output: 'export',
  images: { unoptimized: true },
  // Base path and asset prefix for GitHub Pages (project pages)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (isGitHubPages ? '/unique_tshirt_frontend' : ''),
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || (isGitHubPages ? '/unique_tshirt_frontend/' : ''),
  // Skip dynamic route validation during build
  trailingSlash: true,
};

export default nextConfig;
