export type TInvoiceProcessStatusResponse = {
    total: number
    done: boolean
    statusCounts: Partial<Record<"queued" | "processing" | "success" | "failed", number>>
}