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
import { AppSlug } from "@snappin/shared/apps/app.enum";
import { OutlookRepository } from "./lib/db/outlook.repository";

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
    getIntegrationData,
    resolveMessageIds
} as EmailApps<AppSlug.OUTLOOK>