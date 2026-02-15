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
import { buildIntegrationData } from "./lib/buildIntegrationData";
import { normalizeNotification } from "./lib/normalizeNotification";
import { resolveMessageIds } from "./lib/resolveMessageIds";
import { AppSlug } from "@snappin/shared/apps/app.enum";
import { GmailRepository } from "./lib/db/gmail.repository";

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
    buildIntegrationData,
    normalizeNotification,
    getIntegrationData,
    resolveMessageIds,
    getEmail
} as EmailApps<AppSlug.GMAIL>