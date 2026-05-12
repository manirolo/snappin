/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snappin/ui"],
  modularizeImports: {
    "@hugeicons-pro/core-bulk-rounded": {
      transform: "@hugeicons-pro/core-bulk-rounded/{{member}}"
    },
    "@hugeicons-pro/core-solid-rounded": {
      transform: "@hugeicons-pro/core-solid-rounded/{{member}}"
    },
  },
  experimental: {
    optimizeCss: true, // inlines critical CSS, defers the rest
  },
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: "filesystem", // Persist cache across restarts
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;