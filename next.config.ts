import type { NextConfig } from "next";

/**
 * Keep Turbopack rooted in this Next.js app, even if a parent directory
 * happens to contain an unrelated package-lock.json or package.json.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Mobile Safari/Chrome loads the app through the laptop's Wi-Fi IP.
  // A scoped allowedDevOrigins entry lets Next's dev client/HMR function
  // over that LAN address without permitting arbitrary network origins.
  allowedDevOrigins: process.env.NEXT_LAN_HOST
    ? [process.env.NEXT_LAN_HOST]
    : [],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
