// packages/env/src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WXT_CLERK_PUBLISHABLE_KEY: string
  readonly WXT_API_URL: string
  readonly WXT_APP_URL: string
  readonly WXT_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}