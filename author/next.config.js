/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "rose-manga.com",
      "backend.skz.app",
      "load.skz.app",
      "sv1.skz.app",
    ],
  },
};

module.exports = nextConfig;
