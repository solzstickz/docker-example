/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      "filebroker-cdn.lazada.co.th",
      "god-manga.com",
      "ped-manga.com",
      "rose-manga.com",
      "7.soul-manga.com",
      "sv1.skz.app",
    ],
  },
};

module.exports = nextConfig;
