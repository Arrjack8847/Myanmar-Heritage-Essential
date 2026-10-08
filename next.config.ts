import type { NextConfig } from "next";

/**
 * Keep Turbopack rooted in this Next.js app, even if a parent directory
 * happens to contain an unrelated package-lock.json or package.json.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
