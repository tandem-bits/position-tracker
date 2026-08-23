import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "animated-potato-6vg4x9xrq97pc57vw-3000.app.github.dev" 
      ],
    },
  },
};

export default nextConfig;
