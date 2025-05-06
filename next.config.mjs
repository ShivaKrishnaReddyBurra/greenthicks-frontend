/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'greenthicksstorage.blob.core.windows.net',
        pathname: '/product-images/**',
      },
    ],
  },
};

export default nextConfig;