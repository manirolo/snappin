import { AppCategory, AppDefinition, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";
import { XeroConfigData } from "./xero.types";
import { xeroMetadata } from "./xero.metadata";
import { xeroConfigData } from "./xero.config";
import { generateSessionUrl } from "./lib/generateSessionUrl"
import { resolveIdentity } from "./lib/resolveIdentity";
import { getAccessToken } from "./lib/getAccessToken";
import { buildIntegrationData } from "./lib/buildIntegrationData";
import { revokeToken } from "./lib/revokeToken";
import { exchangeCodeForTokens } from "./lib/exchangeCodeForToken";
import { getUserEmailAddress } from "./lib/getUserEmailAddress";
import { getAccounts } from "./lib/getAccounts";
import { createBill } from "./lib/createBill";

export const XeroAppServices = {
    generateSessionUrl,
    resolveIdentity,
    getAccessToken,
    getUserEmailAddress,
    buildIntegrationData,
    revokeToken,
    exchangeCodeForTokens,
    getAccounts,
    createBill
} 

export const xeroApp: AppDefinition<XeroConfigData> = {
    slug: AppSlug.XERO,
    role: [AppRole.INVOICE_DESTINATION],
    category: AppCategory.ACCOUNTING,
    type: AppType.DESTINATION,
    metadata: xeroMetadata,
    config: xeroConfigData,
}
