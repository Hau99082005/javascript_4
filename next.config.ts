import type { NextConfig } from "next";
import { DB_URI, API, NEXTAUTH_SECRET,GOOGLE_API_KEY ,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} from "./config";

const nextConfig: NextConfig = {
  env: {
    DB_URI,
    API,
    NEXTAUTH_SECRET,
    GOOGLE_API_KEY,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; 