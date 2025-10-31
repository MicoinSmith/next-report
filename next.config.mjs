/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  env: {
    API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
