import type { NextConfig } from "next";
import { DB_URI, API, NEXTAUTH_SECRET,GOOGLE_API_KEY } from "./config";

const nextConfig: NextConfig = {
  env: {
    DB_URI,
    API,
    NEXTAUTH_SECRET,
    GOOGLE_API_KEY
  }
};

export default nextConfig; 