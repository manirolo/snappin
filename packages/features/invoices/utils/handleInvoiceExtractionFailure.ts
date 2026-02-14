import { logger } from "@snappin/lib/logger";
import { invoiceSave } from "../trigger/invoice.save";
import { TInvoiceExtract } from "../trigger/invoice.extract.schema";
import { LLMErrorMeta, SnappinError } from "@snappin/lib/error/snappin.error";
import { ZAnalyzeEngine, ZOCREngine, ZExtractionStatus } from "@snappin/shared/invoice/invoice.schema";

export async function handleInvoiceExtractionFailure(err: unknown, payload: TInvoiceExtract) {
    if (err instanceof SnappinError) {
        const meta = err.meta as LLMErrorMeta | undefined;
        logger.error({
            name: err.name,
            code: err.code,
            message: err.message
        });

        await invoiceSave.trigger({
            invoice: null,
            vendor: null,
            extraction: {
                ocrEngine: ZOCREngine.options[0],
                analyzeEngine: meta?.analyzeEngine ? meta?.analyzeEngine : null,
                status: ZExtractionStatus.options[2], // FAILED
                error: {
                    code: err.code,
                    message: err.message
                }
            },
            source: payload.source,
            integration: payload.integration
        });

        return;
    }

    // Unknown / system error
    logger.error(err);

    await invoiceSave.trigger({
        invoice: null,
        vendor: null,
        extraction: {
            ocrEngine: ZOCREngine.options[0],
            analyzeEngine: ZAnalyzeEngine.options[0],
            status: ZExtractionStatus.options[2], // FAILED
            error: {
                code: "unknown",
                message: "Unhandled invoice extraction error",
            }
        },
        source: payload.source,
        integration: payload.integration
    });
}
