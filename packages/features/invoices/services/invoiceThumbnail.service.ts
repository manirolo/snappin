export interface ThumbnailUploadInput {
    buffer: Buffer       
    fileName: string
    userId: string
}

export interface ThumbnailUploadOutput {
    thumbnailFileId: string
    thumbnailTempPath: string
}

export class ThumbnailService {
    private async getServices() {
        const [{ pdfFirstPageToThumbnail }, { storageService }] = await Promise.all([
            import("../utils/pdfToThumbnail"),
            import("@snappin/infra/google/storage"),
        ])
        return { pdfFirstPageToThumbnail, storageService }
    }

    // Generate JPEG thumbnail from first page of a PDF buffer
    async generate(pdfBuffer: Buffer): Promise<Buffer> {
        const { pdfFirstPageToThumbnail } = await this.getServices()
        return pdfFirstPageToThumbnail(pdfBuffer)
    }

    // Upload thumbnail buffer to GCS temp
    async uploadToTemp(input: ThumbnailUploadInput): Promise<ThumbnailUploadOutput | null | undefined> {
        const { storageService } = await this.getServices()

        const { buffer, fileName, userId } = input
        const thumbnailFileName = fileName.replace(/\.pdf$/i, "") + "_thumb.jpg"

        try {
            const thumbnailBuffer = await this.generate(buffer)

            const uploadResponse = await storageService.uploadTemp({
                userId,
                fileName: thumbnailFileName,
                buffer: thumbnailBuffer,
                contentType: "image/jpeg",
            })

            if (!uploadResponse?.fileId) return null

            return {
                thumbnailFileId: uploadResponse.fileId,
                thumbnailTempPath: thumbnailFileName,
            }
        } catch (err) {
            console.warn("[ThumbnailService] Thumbnail generation/upload failed:", err)
            return null
        }
    }

    // Move thumbnail from temp → permanent GCS path
    async promote({
        tempFileId,
        destinationPath,
    }: {
        tempFileId: string
        destinationPath: string
    }): Promise<string | null> {
        const { storageService } = await this.getServices()

        try {
            const response = await storageService.move({
                sourceFileId: tempFileId,
                destinationPath,
            })
            return response?.fileId ?? null
        } catch (err) {
            console.warn("[ThumbnailService] Thumbnail promotion failed:", err)
            return null
        }
    }
}

export const thumbnailService = new ThumbnailService()