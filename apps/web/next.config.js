/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snappin/ui"],
  output: "standalone",
  modularizeImports: {
    "@hugeicons-pro/core-bulk-rounded": {
      transform: "@hugeicons-pro/core-bulk-rounded/{{member}}"
    },
    "@hugeicons-pro/core-solid-rounded": {
      transform: "@hugeicons-pro/core-solid-rounded/{{member}}"
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