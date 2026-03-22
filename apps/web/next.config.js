/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snappin/ui", "@snappin/features"],
  modularizeImports: {
    "@hugeicons-pro/core-bulk-rounded": {
      transform: "@hugeicons-pro/core-bulk-rounded/{{member}}"
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
