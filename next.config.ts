import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // this folder is the project root (stops Next from picking up a lockfile higher up on the machine)
  turbopack: { root: __dirname },
};

export default nextConfig;
