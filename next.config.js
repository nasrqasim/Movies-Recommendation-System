/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow remote movie posters from IMDb CDN
    domains: ['m.media-amazon.com'],
  },
}

module.exports = nextConfig

