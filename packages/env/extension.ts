export const extensionEnv = {
  clerk: {
    publishableKey: import.meta.env.WXT_CLERK_PUBLISHABLE_KEY as string,
  },
  app: {
    // apiUrl: import.meta.env.WXT_API_URL as string,
    appUrl: import.meta.env.WXT_APP_URL as string,
  },
//   env: import.meta.env.WXT_ENV as string,
}

// export const IS_PRODUCTION  = extensionEnv.env === 'production'
// export const IS_STAGING     = extensionEnv.env === 'staging'
// export const IS_DEVELOPMENT = extensionEnv.env === 'development'