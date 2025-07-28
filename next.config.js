/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  images: {
    domains: ['chateaudevallery.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig