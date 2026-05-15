import { OutlookIntegration } from "@snappin/shared/integration/integration.schema";
import { IsWatchExpires, IsWatchExpiresResponse } from "../../appRegistry.interface";
import { isWithinWindow } from "../../lib/watchExpiry";

// Outlook renew window: 3 days before, expired within 24h ago
const OUTLOOK_RENEW_BEFORE_MS = 24 * 60 * 60 * 1000;
const OUTLOOK_MAX_EXPIRED_MS = 24 * 60 * 60 * 1000;

export async function isWatchExpires({ integration }: IsWatchExpires): Promise<IsWatchExpiresResponse> {
    const outlook = integration as OutlookIntegration;
    const expiresAt = outlook.metadata?.subscriptionExpiresAt;

    if (!expiresAt) return Promise.resolve(true);

    const expiresAtMs = new Date(expiresAt).getTime();
    if (!Number.isFinite(expiresAtMs)) return Promise.resolve(true);

    return Promise.resolve(isWithinWindow(expiresAtMs, OUTLOOK_RENEW_BEFORE_MS, OUTLOOK_MAX_EXPIRED_MS));
}