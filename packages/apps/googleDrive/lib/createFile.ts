import { CreateFileProps, CreateFileResponse } from "../../appRegistry.interface";
import { Readable } from "node:stream";
import { getGoogleDriveClient } from "../googleDrive.client";
import { resolveStoragePath } from "@snappin/lib/storage/resolveStoragePaths";
import { createFileName } from "@snappin/lib/file/fileName";
import { GaxiosError } from "gaxios";
import { markReAuthenticationRequired } from "../../utils/markReAuthenticationRequired";

export async function createFile({
    accessToken,
    integrationId,  // 👈 add this to props
    rootFolderId,
    fileName,
    mimeType,
    content,
    strategy,
    year,
    vendor,
    format,      
    date,        
    invoiceId,  
    amount,      
    currency,    
}: CreateFileProps): Promise<CreateFileResponse> {
    try {
        const drive = getGoogleDriveClient(accessToken);

        const resolvedFileName = format
            ? createFileName({ format, date, vendor, invoiceId, amount, currency })
            : fileName;

        const { folders } = resolveStoragePath({
            strategy,
            year,
            vendor,
            fileName: resolvedFileName,
        });

        let parentFolderId = rootFolderId;
        for (const folderName of folders) {
            const existing = await drive.files.list({
                q: `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: "files(id)",
            });

            if (existing.data.files?.length) {
                const folderId = existing.data.files[0]?.id;
                if (!folderId) throw new Error(`Found folder '${folderName}' but id was missing`);
                parentFolderId = folderId;
            } else {
                const created = await drive.files.create({
                    requestBody: {
                        name: folderName,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [parentFolderId],
                    },
                    fields: "id",
                });
                parentFolderId = created.data.id!;
            }
        }

        const response = await drive.files.create({
            requestBody: {
                name: resolvedFileName,
                parents: [parentFolderId],
            },
            media: {
                mimeType,
                body: Readable.from(content),
            },
            fields: "id, webViewLink",
        });

        return {
            fileId: response.data.id!,
            fileUrl: response.data.webViewLink ?? null,
        };

    } catch (error) {
        if (isAuthError(error)) {
            await markReAuthenticationRequired(integrationId);
            throw new ReAuthRequiredError("Google Drive authentication expired. Please reconnect your Google Drive.");
        }
        throw error;
    }
}

function isAuthError(error: unknown): error is GaxiosError {
    if (error instanceof GaxiosError) {
        const status = error.response?.status;
        return status === 401 || status === 403;
    }
    return false;
}

// Typed error your tRPC/API layer can catch and return a structured response
export class ReAuthRequiredError extends Error {
    readonly code = "REAUTH_REQUIRED";
    constructor(message: string) {
        super(message);
        this.name = "ReAuthRequiredError";
    }
}