/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snappin/ui"],
  modularizeImports: {
    "@hugeicons-pro/core-bulk-rounded": {
      transform: "@hugeicons-pro/core-bulk-rounded/{{member}}"
    },
    "@hugeicons-pro/core-solid-rounded": {
      transform: "@hugeicons-pro/core-solid-rounded/{{member}}"
    }
  },
  cacheHandler: undefined,
  cacheMaxMemorySize: 0,
};
