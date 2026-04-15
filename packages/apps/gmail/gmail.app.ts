import { EmailApps } from "../appRegistry.interface";
import { exchangeCodeForTokens } from "./lib/exchangeCodeForToken";
import { generateSessionUrl } from "./lib/generateSessionUrl";
import { getAccessToken } from "./lib/getAccessToken";
import { getEmail } from "./lib/getEmail";
import { getUserEmailAddress } from "./lib/getUserEmailAddress";
import { getCursor } from "./lib/getCursor";
import { listMessagesSince } from "./lib/listMessagesSince";
import { revokeToken } from "./lib/revokeToken";
import { normalizeTimestamps } from "./lib/normalizeTimestamps";
import { startWatching } from "./lib/startWatching";
import { stopWatching } from "./lib/stopWatching";
import { renewWatching } from "./lib/renewWatching";
import { isWatchExpires } from "./lib/isWatchExpires";
import { buildIntegrationData } from "./lib/buildIntegrationData";
import { normalizeNotification } from "./lib/normalizeNotification";
import { resolveMessageIds } from "./lib/resolveMessageIds";
import { resolveIdentity } from "./lib/resolveIdentity";
import { AppCategory, AppDefinition, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";
import { GmailRepository } from "./lib/db/gmail.repository";
import { gmailMetadata } from "./gmail.metadata";
import { gmailConfigData } from "./gmail.config";
import { GmailConfigData } from "./gmail.types";

const { getIntegrationData } = new GmailRepository()

export const GmailAppServices = {
    generateSessionUrl,
    getAccessToken,
    exchangeCodeForTokens,
    getUserEmailAddress,
    revokeToken,
    getCursor,
    listMessagesSince,
    normalizeTimestamps,
    startWatching,
    stopWatching,
    renewWatching,
    isWatchExpires,
    buildIntegrationData,
    resolveIdentity,
    normalizeNotification,
    getIntegrationData,
    resolveMessageIds,
    getEmail
} as EmailApps<AppSlug.GMAIL>


export const gmailApp: AppDefinition<GmailConfigData> = {
    slug: AppSlug.GMAIL,
    role: [AppRole.EMAIL_SOURCE],
    category: AppCategory.EMAIL,
    type: AppType.SOURCE,
    metadata: gmailMetadata,
    config: gmailConfigData,
}
