// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "daily-health-suppliment.vercel.app"], // Add the domain from where images are served
  },
};

export default nextConfig;
