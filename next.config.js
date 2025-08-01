/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  images: {
    domains: ['chateaudevallery.com'],
    formats: ['image/webp', 'image/avif'],
    // Use unoptimized images to avoid sharp dependency issues in serverless
    unoptimized: true,
  },
  // Netlify-specific optimizations
  experimental: {
    // Reduce serverless function size
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
  // Webpack configuration to handle native modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize sharp to prevent bundling issues
      config.externals.push('sharp')
    }
    return config
  },
}

module.exports = nextConfig