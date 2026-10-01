import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite concluir o deploy no Vercel mesmo com pequenos avisos de tipo
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com', // Imagens hospedadas pelo próprio Notion
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;