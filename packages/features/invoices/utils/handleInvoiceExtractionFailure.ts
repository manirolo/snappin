export async function handleInvoiceExtractionFailure(err: unknown, extractionRequestId: string) {
    const [
        { logger },
        { SnappinError },
        { InvoiceExtractionRequestService },
        { ZExtractionStatus },
        { getUnixSeconds }
    ] = await Promise.all([
        import("@snappin/lib/logger"),
        import("@snappin/lib/error/snappin.error"),
        import("../services/invoiceExtractionRequest.service"),
        import("@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema"),
        import("@snappin/lib/date/unixSeconds"),
    ]);

    const invoiceExtractionRequest = new InvoiceExtractionRequestService();

    if (err instanceof SnappinError) {
        logger.error({
            name: err.name,
            code: err.code,
            message: err.message
        });

        await invoiceExtractionRequest.updateRequest(extractionRequestId, {
            error: {
                code: err.code,
                message: err.message
            },
            status: ZExtractionStatus.options[3],
            completedAt: getUnixSeconds()
        });

        return;
    }

    // Unknown / system error
    logger.error(err);
    await invoiceExtractionRequest.updateRequest(extractionRequestId, {
        status: ZExtractionStatus.options[3],
        completedAt: getUnixSeconds()
    });
}