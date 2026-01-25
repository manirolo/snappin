import { exchangeCodeForTokens } from "./lib/exchangeCodeForToken";
import { generateSessionUrl } from "./lib/generateSessionUrl";
import { getAccessToken } from "./lib/getAccessToken";
import { getEmailByMessageId } from "./lib/getEmailByMessageId";
import { getMessageIdsByHistoryId } from "./lib/getMessageIdsByHistoryId";
import { getUserEmailAddress } from "./lib/getUserEmailAddress";
import { revokeToken } from "./lib/revokeToken";
import { startWatching } from "./lib/startWatching";
import { stopWatching } from "./lib/stopWatching";

export const GmailAppServices = {
    generateSessionUrl,
    getAccessToken,
    exchangeCodeForTokens,
    startWatching,
    stopWatching,
    getMessageIdsByHistoryId,
    getEmailByMessageId,
    getUserEmailAddress,
    revokeToken
}