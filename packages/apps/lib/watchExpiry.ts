// lib/watch-expiry.ts
export const isWithinWindow = (expiresAt: number, renewBeforeMs: number, maxExpiredMs: number): boolean => {
    const now = Date.now();
    return expiresAt <= now + renewBeforeMs && expiresAt >= now - maxExpiredMs;
};