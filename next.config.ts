import type { NextConfig } from "next";
import { DB_URI, API, NEXTAUTH_SECRET } from "./config";

const nextConfig: NextConfig = {
  env: {
    DB_URI,
    API,
    NEXTAUTH_SECRET,
  }
};

export default nextConfig; 