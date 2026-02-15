import { SnappinError } from "@snappin/lib/error/snappin.error";
import { TOCREngine } from "@snappin/shared/invoice/invoice.schema"

export type OCRInput = {
    buffer: Buffer;
    mimeType?: string;
};

export type OCRResult<T> = {
    raw: T | undefined;
    extractedAt: number;
    ocrEngine: TOCREngine
};

export interface OCREngine<T> {
    extract(input: OCRInput): Promise<T>;
}

/**
 * OCRService
 *
 * Enforces OCR invariants and error classification.
 * Provider-specific logic lives behind OCREngine.
 */
export class OCRService<T> {
    constructor(
        private readonly engine: OCREngine<T>,
        private readonly ocrEngine: TOCREngine,
        private readonly logger: {
            info(msg: string, meta?: unknown): void;
            warn(msg: string, meta?: unknown): void;
            error(msg: string, meta?: unknown): void;
        }
    ) { }

    async extract(input: OCRInput): Promise<OCRResult<T>> {
        const start = Date.now();

        let raw: T;
        try {
            raw = await this.engine.extract(input);
        } catch (err) {
            this.logger.error("ocr_engine_failure", err);
            throw new SnappinError("Ocr engine failed", "ocr_engine_failed");
        }

        if (this.isEmpty(raw)) {
            this.logger.warn("ocr_empty_result");
            throw new SnappinError("Ocr result empty", "ocr_empty_result");
        }

        this.logger.info("ocr_success", {
            latencyMs: Date.now() - start,
        });

        return {
            raw,
            extractedAt: Date.now(),
            ocrEngine: this.ocrEngine
        };
    }

    private isEmpty(raw: unknown): boolean {
        if (!raw) return true;
        if (Array.isArray(raw)) return raw.length === 0;
        if (typeof raw === "object") return Object.keys(raw).length === 0;
        return false;
    }
}