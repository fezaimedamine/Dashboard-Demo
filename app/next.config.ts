import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preview and API calls use 127.0.0.1: allow dev resources (HMR, client chunks) from it.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
