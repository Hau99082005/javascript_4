import type { NextConfig } from "next";
import { DB_URI, API } from "./config";

const nextConfig: NextConfig = {
  env: {
    DB_URI,
    API,
  }
};

export default nextConfig; 