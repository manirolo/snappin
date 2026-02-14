import { ZAnalyzeEngine } from "@snappin/shared/invoice/invoice.schema"

export type SnappinErrorCode =
    | "llm_empty_response"
    | "llm_invalid_json"
    | "ocr_empty_result"
    | "ocr_engine_failed"
    | "storage_upload_failed"
    | "storage_failed"
    | "invoice_standardization_failed"
    | "invoice_standardization_empty"

export type LLMErrorMeta = {
    analyzeEngine?: (typeof ZAnalyzeEngine.options)[number];
};

export class SnappinError extends Error {
    public readonly code: SnappinErrorCode;
    public readonly meta?: Record<string, unknown>

    constructor(message: string, code: SnappinErrorCode, meta?: Record<string, unknown>) {
        super(message);
        this.name = "SnappinError"
        this.code = code
        this.meta = meta

        Object.setPrototypeOf(this, new.target.prototype)
    }
}