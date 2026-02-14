import { SnappinError } from "@snappin/lib/error/snappin.error";
import { NormalizedField, NormalizedLineItem } from "../normalizers/normalizer.service";
import { AnalyzeEngine } from "@snappin/shared/invoice/invoice.schema";

/**
 * Input to any invoice standardizer.
 * Engine-agnostic, domain-level structure.
 */
export type StandardizerInput = {
    vendor: NormalizedField[];
    receiver: NormalizedField[];
    invoice: NormalizedField[];
    lineItems: NormalizedLineItem[] | null;
};

/**
 * Output of invoice standardization.
 * Concrete type is owned by the engine.
 */
export type StandardizerResult<T> = {
    data: T;
    analyzeEngine: AnalyzeEngine;
};

/**
 * Contract for any invoice standardizer engine
 * (Gemini, future OpenAI, rules-based, etc).
 */
export interface InvoiceStandardizer<T> {
    standardize(input: StandardizerInput): Promise<T>;
}

/**
 * StandardizerService
 *
 * Responsibilities:
 * - Execute a standardizer engine
 * - Enforce invariants (non-empty output)
 * - Classify errors
 *
 * Non-responsibilities:
 * - Prompt construction
 * - AI vendor logic
 * - Schema definition
 */
export class StandardizerService<T> {
    constructor(
        private readonly engine: InvoiceStandardizer<T>,
        private readonly analyzeEngine: AnalyzeEngine,
        private readonly logger: {
            info(msg: string, meta?: unknown): void;
            warn(msg: string, meta?: unknown): void;
            error(msg: string, meta?: unknown): void;
        }
    ) { }

    async standardize(input: StandardizerInput): Promise<StandardizerResult<T>> {
        const start = Date.now();

        let data: T;

        try {
            data = await this.engine.standardize(input);
        } catch (err) {
            this.logger.error("invoice_standardization_failed", err);
            throw new SnappinError(
                "Invoice standardization failed",
                "invoice_standardization_failed",
                { analyzeEngine: this.analyzeEngine }
            );
        }

        if (!data) {
            this.logger.warn("invoice_standardization_empty");
            throw new SnappinError(
                "Invoice standardization returned empty result",
                "invoice_standardization_empty",
                { analyzeEngine: this.analyzeEngine }
            );
        }

        this.logger.info("invoice_standardization_success", {
            analyzeEngine: this.analyzeEngine,
            latencyMs: Date.now() - start,
        });

        return {
            data,
            analyzeEngine: this.analyzeEngine,
        };
    }
}
