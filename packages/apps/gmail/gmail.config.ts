import { env } from "@snappin/env";
import { GmailConfigData } from "./gmail.types";

const getTopic = (): string => {
    return env.env == "production" ? `projects/${env.google.projectId}/topics/gmail-events-production`
        : env.env == "staging" ? `projects/${env.google.projectId}/topics/gmail-events-staging`
            : `projects/${env.google.projectId}/topics/gmail-events-dev`
}

export const gmailConfigData: GmailConfigData = {
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    callbackUrl: `${env.app.frontend_url}/api/v1/integration/callback`,
    permissions: ["https://www.googleapis.com/auth/gmail.readonly"],
    topic: getTopic(),
}