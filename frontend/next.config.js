/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  images: {
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
