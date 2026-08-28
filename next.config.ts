import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        basePath: '/invite',
        assetPrefix: '/invite/',
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
