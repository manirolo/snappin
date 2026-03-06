export const LONG_THROTTLE_THRESHOLD_SECONDS = 60;

export class LongThrottleError extends Error {
    constructor(
        public readonly retryAfterSeconds: number,
        public readonly reason: string
    ) {
        super(`Rate limited for ${retryAfterSeconds}s — pausing`);
        this.name = "LongThrottleError";
    }
}

type RetryOptions = {
    maxAttempts?: number;
    baseDelayMs?: number;
    shouldRetry?: (err: unknown) => boolean;
    onThrottle?: (err: unknown, attempt: number, delayMs: number) => Promise<void>;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const {
        maxAttempts = 5,
        baseDelayMs = 1000,
        shouldRetry = isRateLimitError,
        onThrottle
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const isLast = attempt === maxAttempts;
            if (isLast || !shouldRetry(err)) throw err;

            const retryAfterSeconds = getRetryAfter(err);

            // Long throttle — exit immediately, let caller pause
            if (retryAfterSeconds && retryAfterSeconds > LONG_THROTTLE_THRESHOLD_SECONDS) {
                throw new LongThrottleError(retryAfterSeconds, getThrottleReason(err));
            }

            const delay = retryAfterSeconds
                ? retryAfterSeconds * 1000
                : baseDelayMs * 2 ** (attempt - 1) + Math.random() * 500;

            await onThrottle?.(err, attempt, delay);
            await sleep(delay);
        }
    }

    throw new Error("Unreachable");
}

export function isRateLimitError(err: unknown): boolean {
    const gErr = err as { code?: number; errors?: { reason?: string }[] };
    if (gErr?.code === 429) return true;
    if (gErr?.errors?.some((e) => e.reason === "rateLimitExceeded" || e.reason === "userRateLimitExceeded")) return true;

    const oErr = err as { statusCode?: number };
    if (oErr?.statusCode === 429) return true;

    if (err instanceof Error && err.message.toLowerCase().includes("429")) return true;

    return false;
}

export function getRetryAfter(err: unknown): number | null {
    const e = err as { response?: { headers?: { "retry-after"?: string } } };
    const header = e?.response?.headers?.["retry-after"];
    if (!header) return null;
    const parsed = parseInt(header, 10);
    return isNaN(parsed) ? null : parsed;
}

export function getThrottleReason(err: unknown): string {
    const gErr = err as { errors?: { reason?: string }[] };
    if (gErr?.errors?.[0]?.reason) return gErr.errors[0].reason;

    const httpErr = err as { statusCode?: number; code?: number };
    if (httpErr?.statusCode === 429 || httpErr?.code === 429) return "429";

    return "unknown";
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));