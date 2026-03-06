import { EmailApps } from "../appRegistry.interface";
import { exchangeCodeForTokens } from "./lib/exchangeCodeForToken";
import { generateSessionUrl } from "./lib/generateSessionUrl";
import { getAccessToken } from "./lib/getAccessToken";
import { getEmail } from "./lib/getEmail";
import { getUserEmailAddress } from "./lib/getUserEmailAddress";
import { revokeToken } from "./lib/revokeToken";
import { getCursor } from "./lib/getCursor";
import { listMessagesSince } from "./lib/listMessagesSince";
import { normalizeTimestamps } from "./lib/normalizeTimestamps";
import { startWatching } from "./lib/startWatching";
import { stopWatching } from "./lib/stopWatching";
import { renewWatching } from "./lib/renewWatching";
import { buildIntegrationData } from "./lib/buildIntegrationData";
import { normalizeNotification } from "./lib/normalizeNotification";
import { resolveMessageIds } from "./lib/resolveMessageIds";
import { AppCategory, AppDefinition, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";
import { OutlookRepository } from "./lib/db/outlook.repository";
import { OutlookConfigData } from "./outlook.types"
import { outlookConfig } from "./outlook.config";
import { outlookMetadata } from "./outlook.metadata";

const { getIntegrationData } = new OutlookRepository()

export const OutlookAppServices = {
    exchangeCodeForTokens,
    generateSessionUrl,
    getAccessToken,
    getEmail,
    getUserEmailAddress,
    revokeToken,
    getCursor,
    listMessagesSince,
    normalizeTimestamps,
    startWatching,
    stopWatching,
    renewWatching,
    buildIntegrationData,
    normalizeNotification,
    resolveMessageIds,
    getIntegrationData,
} as EmailApps<AppSlug.OUTLOOK>

export const outlookApp: AppDefinition<OutlookConfigData> = {
    slug: AppSlug.OUTLOOK,
    role: [AppRole.EMAIL_SOURCE],
    category: AppCategory.EMAIL,
    type: AppType.SOURCE,
    config: outlookConfig,
    metadata: outlookMetadata,
}
