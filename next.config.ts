import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    ...(process.env.NODE_ENV === 'production' && {output: 'standalone'}),
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === 'production',
    }
};

export default nextConfig;