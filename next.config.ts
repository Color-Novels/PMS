import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // CRITICAL: Enable standalone mode for Docker
    output: 'standalone',

    // Disable source maps in production to reduce bundle size
    productionBrowserSourceMaps: false,

    // Enable compression for smaller responses
    compress: true,

    // Optimize images
    images: {
        formats: ['image/webp', 'image/avif'],
        // Add your image domains if you're loading external images
        domains: [
            // 'example.com',
            // 'your-cdn-domain.com'
        ],
        // Disable if you don't use next/image to reduce bundle size
        // unoptimized: true,
    },

    // Experimental features for smaller bundles
    experimental: {
        // Optimize CSS
        optimizeCss: true,

        // Tree shake unused code more aggressively
        optimizePackageImports: [
            'lucide-react',
            'react-icons',
            'date-fns',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            // Add other large packages you use
        ],
    },

    // Webpack optimization
    webpack: (config, { isServer }) => {
        // Reduce bundle size by excluding unused modules
        config.resolve.alias = {
            ...config.resolve.alias,
            // Exclude server-only packages from client bundle
            '@prisma/client': isServer ? '@prisma/client' : false,
        }

        // Optimize for production
        if (config.mode === 'production') {
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks.cacheGroups,
                    // Separate vendor chunks for better caching
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        maxSize: 244000, // 244KB chunks
                    },
                },
            }
        }

        return config
    },

    // Server-side rendering optimization
    swcMinify: true,

    // Reduce memory usage during build
    generateBuildId: async () => {
        // Use environment variable or git hash for build ID
        return process.env.BUILD_ID || 'standalone-build'
    },

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ]
    },

    // Environment variables that should be available in the browser
    env: {
        // Only add non-sensitive variables here
        // DATABASE_URL should NOT be here (server-only)
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },

    // TypeScript configuration
    typescript: {
        // Don't fail build on TypeScript errors in production
        // (You should catch these in CI/CD instead)
        ignoreBuildErrors: process.env.NODE_ENV === 'production',
    },

    // ESLint configuration
    eslint: {
        // Don't fail build on ESLint errors in production
        ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    },
}

export default nextConfig