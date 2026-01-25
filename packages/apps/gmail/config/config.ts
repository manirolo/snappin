import { env } from "@snappin/env";
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.enum";

const getTopic = (): string => {
    return env.env == "production" ? `projects/${env.google.projectId}/topics/gmail-events-production`
        : env.env == "staging" ? `projects/${env.google.projectId}/topics/gmail-events-staging`
            : `projects/${env.google.projectId}/topics/gmail-events-dev`
}

export const gmailConfig = {
    name: "Gmail",
    slug: AppSlug.GMAIL,
    category: AppCategory.EMAIL,
    publisher: "Snappin",
    email: "support@snappinapp.com",
    description: "Connect your gmail account to extract invoices",
    icon: "logos:google-icon",

    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    callbackUrl: `${env.app_url}/api/v1/integration/callback`,
    permissions: ["https://www.googleapis.com/auth/gmail.readonly"],
    topic: getTopic(),
}