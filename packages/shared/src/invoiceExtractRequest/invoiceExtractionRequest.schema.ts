import { z } from "zod";
import { SourceKind } from "../apps/app.schema";
import { ZMail } from "../inbox/mail.schema";
import { ZIntegration } from "../integration/integration.schema";

export enum TOCREngine {
    AWS_TEXTRACT = "aws-textract",
    GOOGLE_DOCUMENT_AI = "google-document-ai",
}
export const ZOCREngine = z.enum(TOCREngine);

export enum AnalyzeEngine {
    GEMINI = "gemini",
    TEXTRACT = "textract",
}
export const ZAnalyzeEngine = z.enum(AnalyzeEngine);

export const ZExtractionStatus = z.enum([
    "queued",
    "processing",
    "success",
    "failed",
]);
export type ExtractionStatus = z.infer<typeof ZExtractionStatus>;
const ZMailIntegrationSource = z.object({
    kind: z.literal(SourceKind.INTEGRATION),
    integrationId: z.string().optional().nullable(),      // reference to Integration _id
    externalId: z.string().nullable().optional(),
    isRetroactiveScan: z.boolean().optional(),
    retroactiveScanId: z.string().nullable().optional(),
    metadata: ZMail
})
export const ZIntegrationSource = ZMailIntegrationSource
export const ZManualSource = z.object({
    kind: z.literal(SourceKind.MANUAL),
    metadata: z.object({
        uploadedBy: z.string(),
    })
})
export const ZSource = z.discriminatedUnion("kind", [
    ZIntegrationSource,
    ZManualSource
])
export type SourceResource = z.infer<typeof ZSource>;
export const ZInvoiceError = z.object({
    code: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
})
export type InvoiceErrorResource = z.infer<typeof ZInvoiceError>;

export const ZInvoiceExtractionRequest = z.object({
    _id: z.string().optional(),

    userId: z.string(),
    orgId: z.string().nullable().optional(),

    jobId: z.string().nullable().optional(),
    // File reference stored in GCP
    documentId: z.string(),
    fileName: z.string().nullable().optional(),

    // Where this extraction originated from
    source: ZSource,

    // Processing state
    status: ZExtractionStatus.default("queued"),

    ocrEngine: ZOCREngine.nullable().optional(),
    analyzeEngine: ZAnalyzeEngine.nullable().optional(),

    error: ZInvoiceError.nullable().optional(),

    attempts: z.number().default(0),
    integration: ZIntegration.nullable().optional(),

    // Link to created invoice after success
    invoiceId: z.string().nullable().optional(),

    startedAt: z.number().nullable().optional(),
    completedAt: z.number().nullable().optional(),

    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
}).strict();

export type InvoiceExtractionRequestResource = z.infer<typeof ZInvoiceExtractionRequest>;
