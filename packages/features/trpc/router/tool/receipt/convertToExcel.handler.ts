import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TConvertToExcel } from "./convertToExcel.schema"
import { SourceKind } from "@snappin/shared/apps/app.schema"
import { invoiceExtractionRequestService } from "@snappin/features/invoice/services/invoiceExtractionRequest.service"
import { documentService } from "@snappin/features/invoice/services/invoiceDocument.service"
import { assertResourceAccess } from "../../../lib/assertResourceAccess"
import { TRPCError } from "@trpc/server"
import { getMimeType } from "@snappin/lib/file/getMimeType"
import { usageService } from "@snappin/features/billing/service/usage.service"
import { invoiceExtractService } from "@snappin/features/invoice/services/invoiceExtract.service"
import { SnappinError } from "@snappin/lib/error/snappin.error"
import { invoiceSaveService } from "@snappin/features/invoice/services/invoiceSave.service"
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema"

export type ConvertToExcel = {
    ctx: ContextProps,
    input: TConvertToExcel
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"]

export async function convertToExcel({ ctx, input }: ConvertToExcel) {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    if (!ctx.userId || !ctx.orgId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `Authorization required `,
        })
    }

    await usageService.assertWithinLimit(ctx?.orgId, "invoices")

    if (!input.buffer) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Attachment is empty`,
        })
    }
    const mimeType = await getMimeType(input.buffer)

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Unsupported file type '${input.mimeType}'. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
        })
    }

    if (input.buffer.byteLength > MAX_FILE_SIZE_BYTES) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
        })
    }

    if (!input.fileName?.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "File name is required" })
    }

    const { fileId, fileName } = await documentService.uploadToTemp({
        attachment: {
            kind: "buffer",
            buffer: input.buffer,
            fileName: input.fileName,
            mimeType: input.mimeType,
        },
        userId: ctx.userId,
    })

    const request = await invoiceExtractionRequestService.createRequest({
        userId: ctx.userId,
        orgId: ctx.orgId,
        jobId: crypto.randomUUID(),
        source: {
            kind: SourceKind.MANUAL,
            metadata: { uploadedBy: ctx.userId }
        },
        _integration: null,
        status: "queued",
        documentId: fileId,
        fileName,
        attempts: 0,
    })

    const extractInvoice = await invoiceExtractService.extract(request._id.toString());


    if (!extractInvoice) {
        throw new SnappinError("Invoice extraction failed", "ocr_engine_failed")
    }

    const result = await invoiceSaveService.save(extractInvoice)

    const invoice = await ctx.db.invoice
        .findOne({ _id: result?._id?.toString() })
        .populate("vendor")
        .populate({
            path: "extraction",
            populate: {
                path: "integration",
                select: "_id appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt status"
            },
        })
        .lean<InvoiceResource & { vendor: { name?: string } | null }>();

    return { fileId, data: invoice }
}