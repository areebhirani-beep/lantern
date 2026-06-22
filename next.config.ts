import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next infers the root
  // from the nearest lockfile and warns when other lockfiles exist higher up.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
