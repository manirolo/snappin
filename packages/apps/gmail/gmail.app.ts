import { EmailApps } from "../appRegistry.interface";
import { exchangeCodeForTokens } from "./lib/exchangeCodeForToken";
import { generateSessionUrl } from "./lib/generateSessionUrl";
import { getAccessToken } from "./lib/getAccessToken";
import { getEmailByMessageId } from "./lib/getEmailByMessageId";
import { getMessageIdsByHistoryId } from "./lib/getMessageIdsByHistoryId";
import { getUserEmailAddress } from "./lib/getUserEmailAddress";
import { getCursor } from "./lib/getCursor";
import { listMessagesSince } from "./lib/listMessagesSince";
import { revokeToken } from "./lib/revokeToken";
import { normalizeTimestamps } from "./lib/normalizeTimestamps";
import { startWatching } from "./lib/startWatching";
import { stopWatching } from "./lib/stopWatching";
import { renewWatching } from "./lib/renewWatching";

export const GmailAppServices = {
    generateSessionUrl,
    getAccessToken,
    exchangeCodeForTokens,
    getMessageIdsByHistoryId,
    getEmailByMessageId,
    getUserEmailAddress,
    revokeToken,
    getCursor,
    listMessagesSince,
    normalizeTimestamps,
    startWatching,
    stopWatching,
    renewWatching
} as EmailApps