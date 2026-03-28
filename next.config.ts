import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'i.ytimg.com',
      'startup-template-sage.vercel.app',
      'res.cloudinary.com',
      'www.youtube.com',
      'plus.unsplash.com',
      'i.postimg.cc',
      'media.istockphoto.com',
    ],
  },
}

export default nextConfig