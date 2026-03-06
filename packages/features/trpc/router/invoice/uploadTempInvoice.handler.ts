import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TUploadTempInvoice } from "./uploadTempInvoice.schema"
import { SourceKind } from "@snappin/shared/apps/app.schema"
import { invoiceExtractionRequestService } from "@snappin/features/invoice/services/invoiceExtractionRequest.service"
import { documentService } from "@snappin/features/invoice/services/invoiceDocument.service"

export type UploadTempInvoice = {
  ctx: ContextProps,
  input: TUploadTempInvoice
}

export async function uploadTempInvoice({ ctx, input }: UploadTempInvoice) {
  if (!ctx.userId) return

  const { fileId, fileName } = await documentService.uploadToTemp({
    attachment: {
      kind: "buffer",
      buffer: input.buffer,
      fileName: input.fileName,
      mimeType: input.mimeType,
    },
    userId: ctx.userId,
  })

  const jobId = crypto.randomUUID()

  const request = await invoiceExtractionRequestService.createRequest({
    userId: ctx.userId,
    orgId: ctx.orgId,
    jobId,
    source: {
      kind: SourceKind.MANUAL,
      metadata: { uploadedBy: ctx.userId }
    },
    status: "queued",
    documentId: fileId,
    fileName,
    attempts: 0,
  })

  return { fileId, requestId: request._id.toString() }
}