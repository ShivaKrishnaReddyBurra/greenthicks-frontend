/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bcfresh.ca',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.greendna.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.farmjournal.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.google.com', // Covers encrypted-tbn0.gstatic.com
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drearth.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.planetnatural.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'as1.ftcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rawl.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ewg.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aanmc.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'healthyfamilyproject.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.lexmed.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'produits.bienmanger.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'organicmandya.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'freshindiaorganics.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shopfreshandgreen.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-ilcomcj.nitrocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.marthastewart.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.freshaisle.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'farmlinkhawaii.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'calorganicfarms.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.edenbrothers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.apartmenttherapy.info',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'foodal.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;