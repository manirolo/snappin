export const env = {
  // Clerk setup not completed until you obtain and set these keys in environment variables
  // Publishable key is required for initializing Clerk in the frontend
  // Secret key is required for server-side operations with Clerk
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!,
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL!,
    webhookSecretKey: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  },

  betterAuth: {
    apiKey: process.env.BETTER_AUTH_API_KEY!,
    secret: process.env.BETTER_AUTH_SECRET!,
  },

  crisp: {
    websiteId: process.env.NEXT_PUBLIC_CRISP_ID!,
  },

  encryption: {
    secret: process.env.ENCRYPTION_SECRET!,
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY!,
  },

  sentry: {
    dns: process.env.SENTRY_DNS!,
  },

  mongodb: {
    url: process.env.DB_URL!,
  },

  polar: {
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  },

  ls: {
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    webhookSecret: process.env.LEMONESQUEEZY_WEBHOOK_SECRET!,
    storeId: process.env.LEMONESQUEEZY_STORE_ID!
  },

  env: process.env.NEXT_PUBLIC_ENV!,
  app_url: process.env.NEXT_PUBLIC_APP_URL!,

  app: {
    frontend_url: process.env.NEXT_PUBLIC_APP_URL!,
    admin_url: process.env.NEXT_PUBLIC_ADMIN_URL!,
    api_url: process.env.NEXT_PUBLIC_API_URL!,
    worker_port: process.env.NEXT_PUBLIC_PORT!,
    worker_url: process.env.NEXT_PUBLIC_WORKER_URL!,
  },

  xero: {
    clientId: process.env.XERO_CLIENT_ID!,
    clientSecret: process.env.XERO_CLIENT_SECRET!,
  },

  whatsapp: {
    token: process.env.WHATSAPP_APP_SECRET!,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    appSecret: process.env.WA_APP_SECRET!,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    projectId: process.env.GOOGLE_PROJECT_ID!,
    serviceKey: process.env.GOOGLE_SERVICE_KEY!,
    invoiceExtractorId: process.env.GOOGLE_INVOICE_EXTRACTOR_ID!,
    region: process.env.GOOGLE_REGION!,
    workerUrl: process.env.GOOGLE_WORKER_URL!,
    cloudTaskQueue: process.env.GOOGLE_CLOUD_TASK_QUEUE!,
    taskPubSubTopic: process.env.GOOGLE_TASK_PUB_SUB_TOPIC!,
    cloudTasksServiceAccountEmail: process.env.GOOGLE_TASK_SERVICE_ACCOUNT_EMAIL!,
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