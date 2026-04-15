// packages/infra/google/storage/storage.service.ts
import { Storage } from "@google-cloud/storage"
import { env } from "@snappin/env"
import { toSingleLine } from "./utils/formateKey"

const credential = JSON.parse(
    Buffer.from(toSingleLine(env.google.serviceKey) ?? "", "base64").toString()
)

const getBucket = (): string => {
    return env.env === "production" ? "snappin"
        : env.env === "staging" ? "snappin_staging"
            : "snappin_dev"
}

const storage = new Storage({
    projectId: env.google.projectId,
    credentials: {
        client_email: credential.client_email,
        client_id: credential.client_id,
        private_key: credential.private_key,
    },
})

export const invoiceBucket = storage.bucket(getBucket())
const TEMP_EXPIRY_HOURS = 24

type UploadInvoiceProps = {
    userId?: string | null
    fileName: string
    buffer?: Buffer | null
    contentType?: string | null
}

type UploadResponse = { fileId: string }

type RenameProps = {
    oldFileId: string
    newFileName: string
}

type MoveProps = {
    sourceFileId: string
    destinationPath: string
}

export class StorageService {

    // Permanent upload — user/{userId}/document/{fileName}
    async uploadInvoice({ userId, fileName, buffer, contentType = "application/octet-stream" }: UploadInvoiceProps): Promise<UploadResponse | null> {
        if (!buffer) return null

        const objectPath = `user/${userId}/document/${fileName}`
        const file = invoiceBucket.file(objectPath)

        await file.save(buffer, {
            resumable: false,
            metadata: { cacheControl: "private, max-age=0" },
            contentType: contentType ?? "",
        })

        return { fileId: objectPath }
    }

    // Temp upload — expires in 24h via GCS object lifecycle or metadata
    async uploadTemp({ userId, fileName, buffer, contentType = "application/octet-stream" }: UploadInvoiceProps): Promise<UploadResponse | null> {
        if (!buffer) return null

        const objectPath = `temp/${userId}/document/${fileName}`
        const file = invoiceBucket.file(objectPath)

        const expiresAt = new Date(Date.now() + TEMP_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()

        await file.save(buffer, {
            resumable: false,
            contentType: contentType ?? "",
            metadata: {
                cacheControl: "private, max-age=0",
                metadata: {
                    temp: "true",
                    expiresAt, // used if you sweep manually
                },
            },
        })

        return { fileId: objectPath }
    }

    // Promote temp → permanent (after extraction succeeds)
    async promoteTemp({ oldFileId, newFileName }: RenameProps): Promise<UploadResponse> {
        const oldFile = invoiceBucket.file(oldFileId)

        const newFileId = oldFileId
            .replace(/^temp\//, "user/")
            .replace(/[^/]+$/, newFileName)

        const newFile = invoiceBucket.file(newFileId)

        await oldFile.copy(newFile)
        await oldFile.delete()

        return { fileId: newFileId }
    }

    async move({ sourceFileId, destinationPath }: MoveProps): Promise<UploadResponse> {
        const sourceFile = invoiceBucket.file(sourceFileId)
        const destFile = invoiceBucket.file(destinationPath)

        await sourceFile.copy(destFile)
        await sourceFile.delete()

        return { fileId: destinationPath }
    }

    async rename({ oldFileId, newFileName }: RenameProps): Promise<UploadResponse> {
        const parts = oldFileId.split("/")
        parts[parts.length - 1] = newFileName
        const newFileId = parts.join("/")

        const oldFile = invoiceBucket.file(oldFileId)
        const newFile = invoiceBucket.file(newFileId)

        await oldFile.copy(newFile)
        await oldFile.delete()

        return { fileId: newFileId }
    }

    async delete(fileId: string): Promise<void> {
        try {
            await invoiceBucket.file(fileId).delete({ ignoreNotFound: true })
        } catch (error) {
            console.error("Failed to delete GCS file:", error)
        }
    }

    async getSignedPdfUrl(fileId: string): Promise<string> {
        const [url] = await invoiceBucket.file(fileId).getSignedUrl({
            action: "read",
            expires: Date.now() + 1000 * 60 * 15, // 15 min
            responseType: "application/pdf",
        })
        return url
    }

    async getSignedThumbnailUrl(fileId: string): Promise<string> {
        const [url] = await invoiceBucket.file(fileId).getSignedUrl({
            action: "read",
            expires: Date.now() + 1000 * 60 * 15, // 15 min
            responseType: "image/jpeg",
        })
        return url
    }

    async download(fileId: string): Promise<Buffer> {
        const [buffer] = await invoiceBucket.file(fileId).download()
        return buffer
    }

    // Sweep expired temp files manually (run via cron if no GCS lifecycle rule)
    async purgeExpiredTemp(): Promise<void> {
        const [files] = await invoiceBucket.getFiles({ prefix: "temp/" })
        const now = Date.now()

        await Promise.all(
            files.map(async (file) => {
                const expiresAt = file.metadata?.metadata?.expiresAt as string | undefined
                if (expiresAt && new Date(expiresAt).getTime() < now) {
                    await file.delete({ ignoreNotFound: true })
                }
            })
        )
    }

    async deleteUserFiles(orgId: string, userId: string): Promise<void> {
        await invoiceBucket.deleteFiles({
            prefix: `orgs/${orgId}/users/${userId}/documents/`,
            force: true,
        })
    }

    // Delete all docs for entire org (admin delete)
    async deleteOrgFiles(orgId: string): Promise<void> {
        await invoiceBucket.deleteFiles({
            prefix: `orgs/${orgId}/`,
            force: true,
        })
    }
}

export const storageService = new StorageService()