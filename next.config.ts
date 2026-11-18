import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options */
  serverExternalPackages: [
    "payload",
    "@payloadcms/db-postgres",
    "@payloadcms/richtext-lexical",
    "pg",
    "drizzle-kit",
    "esbuild",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
