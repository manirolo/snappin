import { GmailIntegration } from "@snappin/shared/integration/integration.schema";
import { IsWatchExpires, IsWatchExpiresResponse } from "../../appRegistry.interface";
import { isWithinWindow } from "../../lib/watchExpiry";

// Gmail renew window: 7 days before, expired within 24h ago
const GMAIL_RENEW_BEFORE_MS = 24 * 60 * 60 * 1000;
const GMAIL_MAX_EXPIRED_MS = 24 * 60 * 60 * 1000;

export async function isWatchExpires({ integration }: IsWatchExpires): Promise<IsWatchExpiresResponse> {
    const gmail = integration as GmailIntegration;
    const expiresAt = gmail.metadata?.watchExpiresAt;

    if (!expiresAt) return Promise.resolve(true); // no expiry = treat as expired

    const expiresAtMs = Number(expiresAt);
    if (!Number.isFinite(expiresAtMs)) return Promise.resolve(true);

    return Promise.resolve(isWithinWindow(expiresAtMs, GMAIL_RENEW_BEFORE_MS, GMAIL_MAX_EXPIRED_MS));
}