/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "rose-manga.com",
      "load.9tailmanga.com",
      "sv3.9tailmanga.com",
    ],
    // minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
