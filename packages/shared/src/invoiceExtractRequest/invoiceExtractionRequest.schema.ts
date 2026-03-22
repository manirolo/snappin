import { z } from "zod";
import { SourceKind } from "../apps/app.schema";
import { ZMail } from "../inbox/mail.schema";
import { ZIntegration, ZIntegrationSnapshot } from "../integration/integration.schema";
import { ZUser } from "../user/user.schema";

export const ZExtractionStatus = z.enum([
    "queued",
    "processing",
    "success",
    "failed",
]);
export type ExtractionStatus = z.infer<typeof ZExtractionStatus>;
const ZMailIntegrationSource = z.object({
    kind: z.literal(SourceKind.INTEGRATION),
    integrationId: z.string().optional().nullable(),
    externalId: z.string().nullable().optional(),
    isRetroactiveScan: z.boolean().optional(),
    retroactiveScanId: z.string().nullable().optional(),
    metadata: ZMail.optional().nullable()
})
export type MailIntegrationSource = z.infer<typeof ZMailIntegrationSource>
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
    user: ZUser.optional(),

    // Processing state
    status: ZExtractionStatus.default("queued"),

    error: ZInvoiceError.nullable().optional(),

    attempts: z.number().default(0),
    integration: ZIntegration.nullable().optional(),
    _integration: ZIntegrationSnapshot.optional().nullable(),

    // Link to created invoice after success
    invoiceId: z.string().nullable().optional(),

    startedAt: z.number().nullable().optional(),
    completedAt: z.number().nullable().optional(),

    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
}).strict();

export type InvoiceExtractionRequestResource = z.infer<typeof ZInvoiceExtractionRequest>;
