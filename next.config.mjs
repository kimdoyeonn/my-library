/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'contents.kyobobook.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'search1.kakaocdn.net',
      },
    ],
  },
};

export default nextConfig;
