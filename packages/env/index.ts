export const env = {
  // Clerk setup not completed until you obtain and set these keys in environment variables
  // Publishable key is required for initializing Clerk in the frontend
  // Secret key is required for server-side operations with Clerk
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!,
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL!
  },

  sentry: {
    dns: process.env.SENTRY_DNS!,
  },

  mongodb: {
    url: process.env.DB_URL!,
  },

  env: process.env.ENV!,
  app_url: process.env.NEXT_PUBLIC_APP_URL!,

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    projectId: process.env.GOOGLE_PROJECT_ID!,
    serviceKey: process.env.GOOGLE_SERVICE_KEY!,
    invoiceExtractorId: process.env.GOOGLE_INVOICE_EXTRACTOR_ID!
  },
  aws: {
    region: process.env.AWS_REGION!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!
  },
  microsoft: {
    clientId: process.env.MS_CLIENT_ID!,
    clientSecret: process.env.MS_CLIENT_SECRET!,
    tenantId: process.env.MS_TENANT_ID!,
  },
  logoDev: {
    publicKey: process.env.NEXT_PUBLIC_LOGO_DEV_PUBLIC_KEY!
  }
};

export const IS_PRODUCTION = env.env == "production"
export const IS_STAGING = env.env == "staging"
export const IS_DEVELOPMENT = env.env == "development"