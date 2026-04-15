const AVG_SECONDS_PER_MESSAGE = 17.5; // midpoint of 15–20s per message that needs processing
const INVOICE_LIKELIHOOD = 0.25;       // ~25% of emails are actually invoices/receipts (20-30% range midpoint)

export function estimateScanDuration(totalMessages: number): string {

    // Only ~25% of messages will go through full extraction pipeline
    // The rest get classified as OTHER quickly (~2s each)
    const invoiceMessages   = Math.ceil(totalMessages * INVOICE_LIKELIHOOD);
    const nonInvoiceMessages = totalMessages - invoiceMessages;

    const totalSeconds = Math.ceil(
        (invoiceMessages   * AVG_SECONDS_PER_MESSAGE) +
        (nonInvoiceMessages * 2)  // classification only — fast
    );

    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0 && minutes > 0) return `~${hours} hr ${minutes} mins`;
    if (hours > 0)                return `~${hours} hr`;
    if (minutes > 1)              return `~${minutes} mins`;
    return `~1 min`; // minimum
}