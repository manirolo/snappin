import { IntegrationResource, IntegrationSnapshot } from "../integration/integration.schema"
import mongoose from "mongoose";

export enum ScanStatus {
    QUEUED = "queued",
    IN_PROGRESS = "in_progress",
    SUCCESS = "success",
    FAILED = "failed",
    PAUSED = "paused"
}

export type ScanResource = {
    _id?: string | null;
    userId?: string | null;
    orgId?: string | null;
    integrationId?: string | null;
    integration?: IntegrationResource | null;
    _integration?: IntegrationSnapshot | null,
    scanId?: string | null;
    startDate?: number | null;
    endDate?: number | null;
    totalChunks?: number | null;
    completedChunks?: number | null;
    totalMessages?: number | null;
    processedMessages?: number | null;
    failedMessages?: number | null;
    startedAt?: number | null;
    completedAt?: number | null;
    estimatedDuration?: string | null;
    status?: ScanStatus;
    errorReason?: string | null;
    invoiceFound?: string[] | null;
    rateLimit?: RateLimitInfo;
    wasThrottled?: boolean | null;
    rateLimitHits?: number | null;
    createdAt?: number;
    updatedAt?: number;
}

export enum ScanChunkStatus {
    QUEUED = "queued",
    DISCOVERING = "discovering",
    PROCESSING = "processing",
    PAUSED = "paused",
    SUCCESS = "success",
    FAILED = "failed"
}

export type RateLimitInfo = {
    isThrottled: boolean;
    throttledAt?: number | null;        // unix ms when throttling started
    retryAfter?: number | null;         // seconds to wait (from Retry-After header)
    retryAfterAt?: number | null;
    retryCount: number;                 // how many times this chunk was throttled
    lastThrottleReason?: string | null; // "userRateLimitExceeded" | "rateLimitExceeded" | "429"
}

export type ScanChunkResource = {
    _id?: mongoose.Types.ObjectId | string;
    scanId: mongoose.Types.ObjectId | string;
    integrationId: mongoose.Types.ObjectId | string;
    integration?: IntegrationResource
    startDate: number;
    endDate: number;
    status: ScanChunkStatus;
    pageToken?: string | null;
    hasMorePages: boolean;
    totalMessages: number;
    processedMessages: number;
    failedMessages: number;
    rateLimit?: RateLimitInfo;   // so buildMonthlyChunks doesn't need to provide it
    errorReason?: string;
    startedAt?: number | null;
    completedAt?: number | null;

    expiresAt?: Date | null;
    createdAt: number;
    updatedAt: number;
};


export enum ScanMessageStatus {
    QUEUED = "queued",
    FETCHED = "fetched",
    CLASSIFIED = "classified",
    EXTRACTION_QUEUED = "extraction_queued",
    SUCCESS = "success",
    FAILED = "failed"
}

export type ScanMessageResource = {
    _id?: mongoose.Types.ObjectId | string;

    scanId: mongoose.Types.ObjectId | string;
    chunkId: mongoose.Types.ObjectId | string;
    integrationId: mongoose.Types.ObjectId | string;
    integration?: IntegrationResource | null;

    providerMessageId: string;

    status: ScanMessageStatus;

    invoiceId?: mongoose.Types.ObjectId | string;

    errorReason?: string;

    retryCount: number;

    expiresAt?: Date | null;
    createdAt: number;
    updatedAt: number;
};