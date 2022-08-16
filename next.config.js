/** @type {import('next').NextConfig} */
// const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ['localhost', '192.168.43.229']
  },
  experimental: {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '192.168.43.229',
          port: '8082',
          pathname: '/public/images/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8082',
          pathname: '/public/images/**',
        },
      ],
    },
  },
  // outputFileTracing: true,
  // experimental: {
  //   outputStandalone: true,
  //   outputFileTracingRoot: path.join(__dirname, '../../')
  // },
};

module.exports = nextConfig;
