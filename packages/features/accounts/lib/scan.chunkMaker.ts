import { ScanChunkResource, ScanChunkStatus } from "@snappin/shared/inbox/scan.schema";

type CreateChunksOptions = {
    scanId: string;
    integrationId: string;
    startDate: number;  // unix ms
    endDate: number;    // unix ms
}

export function buildMonthlyChunks({ scanId, integrationId, startDate, endDate }: CreateChunksOptions): Omit<ScanChunkResource, "_id" | "createdAt" | "updatedAt">[] {
    const chunks = [];

    let cursor = new Date(startDate);
    cursor.setDate(1);
    cursor.setHours(0, 0, 0, 0);

    const end = new Date(endDate);

    while (cursor <= end) {
        const chunkStart = cursor.getTime();

        // Move to last ms of the month
        const chunkEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        chunks.push({
            scanId,
            integrationId,
            startDate: chunkStart,
            endDate: Math.min(chunkEnd, endDate),   // don't overshoot the scan's endDate
            status: ScanChunkStatus.QUEUED,
            hasMorePages: false,
            pageToken: null,
            totalMessages: 0,
            processedMessages: 0,
            failedMessages: 0,
        });

        // Advance to next month
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    return chunks;
}