import { xeroConfigData } from "./xero.config"
import { XeroClient } from "xero-node";

export const xero = new XeroClient({
    clientId: xeroConfigData.clientId,
    clientSecret: xeroConfigData.clientSecret,
    redirectUris: [xeroConfigData.callbackUrl],
    scopes: xeroConfigData.permissions,
    httpTimeout: 12000,
})