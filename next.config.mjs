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
  webpack: (config, { isServer }) => {
    // Exclude README.md and other documentation files from the build
    config.module.rules.push({
      test: /\.md$/,
      use: 'ignore-loader',
    });

    // Also exclude other documentation files
    config.module.rules.push({
      test: /\.(txt|mdx)$/,
      use: 'ignore-loader',
    });

    // Exclude binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });

    // Exclude TypeScript declaration files
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'ignore-loader',
    });

    // Exclude LICENSE files
    config.module.rules.push({
      test: /LICENSE$/,
      use: 'ignore-loader',
    });

    // Make sure server-only packages are not bundled for client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
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
