import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        pathname: "/watchdogscombined/images/**",
      },
    ],
  },
};

export default nextConfig;
