import { InvoiceAttachment } from "../trigger/invoice.extractRequest.schema"

export interface InvoiceDocumentSaveInput {
    attachment: InvoiceAttachment
    userId: string
}

export interface InvoiceDocumentSaveOutput {
    fileId: string
    fileName: string
    mimeType: string
}

export interface InvoiceDocumentPromoteInput {
    tempFileId: string
    userId: string
    fileName: string
}

export interface InvoiceDocumentPromoteOutput {
    fileId: string
    filePath: string
}

export class InvoiceDocumentService {

    private async getServices() {
        const [
            { imageToPdf, isImageMimeType },
            { storageService },
            { SnappinError },
        ] = await Promise.all([
            import("../utils/imageToPdf"),
            import("@snappin/infra/google/storage"),
            import("@snappin/lib/error/snappin.error"),
        ])
        return { imageToPdf, isImageMimeType, storageService, SnappinError }
    }

    // Resolves to: user/{userId}/documents/{invoiceDbId}/invoice.pdf
    //              user/{userId}/documents/{invoiceDbId}/thumbnail.jpg
    static buildPaths(userId: string) {
        const uuid = crypto.randomUUID()
        const base = `user/${userId}/documents`
        return {
            document: `${base}/${uuid}.pdf`,
        }
    }

    async uploadToTemp(input: InvoiceDocumentSaveInput): Promise<InvoiceDocumentSaveOutput> {
        const { imageToPdf, isImageMimeType, storageService, SnappinError } =
            await this.getServices()

        const { attachment, userId } = input

        let fileName = attachment.fileName ?? `${Date.now()}_${crypto.randomUUID()}`
        let mimeType = attachment.mimeType ?? "application/octet-stream"

        // Already in GCS — return as-is, no re-upload needed
        if (attachment.kind === "fileId") {
            return { fileId: attachment.fileId, fileName, mimeType }
        }

        let buffer = attachment.buffer

        // Normalize image → PDF
        if (isImageMimeType(mimeType) && buffer) {
            buffer = await imageToPdf(buffer)
            mimeType = "application/pdf"
            fileName = fileName.replace(/\.[^.]+$/, "") + ".pdf"
        }

        if (!buffer) {
            throw new SnappinError("Invoice buffer is empty", "storage_failed")
        }

        // Upload main PDF document to temp
        const uploadResponse = await storageService.uploadTemp({
            userId,
            fileName,
            buffer,
            contentType: mimeType,
        })

        if (!uploadResponse?.fileId) {
            throw new SnappinError("Invoice upload failed", "storage_upload_failed")
        }

        return { fileId: uploadResponse.fileId, fileName, mimeType }
    }

    // Called AFTER DB insert so we have the real invoiceDbId for path building
    async promote(input: InvoiceDocumentPromoteInput): Promise<InvoiceDocumentPromoteOutput> {
        const { storageService, SnappinError } = await this.getServices()

        const { tempFileId, userId } = input
        const paths = InvoiceDocumentService.buildPaths(userId)

        // Promote main document
        const promoteResponse = await storageService.move({
            sourceFileId: tempFileId,
            destinationPath: paths.document,
        })

        if (!promoteResponse?.fileId) {
            throw new SnappinError("Invoice promotion failed", "storage_failed")
        }

        return {
            fileId: promoteResponse.fileId,
            filePath: paths.document,
        }
    }
}

export const documentService = new InvoiceDocumentService()