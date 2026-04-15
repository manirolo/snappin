import { env } from "@snappin/env";
import { XeroConfigData } from "./xero.types";

export const xeroConfigData: XeroConfigData = {
    clientId: env.xero.clientId,
    clientSecret: env.xero.clientSecret,
    callbackUrl: `${env.app.frontend_url}/api/v1/integration/callback`,
    permissions: ["offline_access", "openid", "profile", "email", "accounting.invoices", "accounting.attachments", "accounting.contacts", "accounting.settings"],
}