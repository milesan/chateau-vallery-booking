/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable i18n for static export
  // i18n: undefined,
}

module.exports = nextConfig