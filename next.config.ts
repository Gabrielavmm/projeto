import { NextConfig } from 'next';

// next.config.ts

const nextConfig: NextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['example.com'], // Add your image domains here
    },
};

export default nextConfig;