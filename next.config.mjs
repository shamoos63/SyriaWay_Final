/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Rewrite any path that doesn't start with _next, api, or other system paths
      // and doesn't match any file in the public directory to the 404 page
      {
        source: '/:path*',
        destination: '/not-found',
        has: [
          {
            type: 'header',
            key: 'x-matched-path',
            value: '/:path*',
          },
        ],
      },
    ]
  },
}

export default nextConfig
