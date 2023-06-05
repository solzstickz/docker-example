/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "rose-manga.com",
      "backend.skz.app",
      "18.138.255.117",
      "load.skz.app",
    ],
  },
};

module.exports = nextConfig;
