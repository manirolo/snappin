import { Storage } from "@google-cloud/storage";
import { env } from "@snappin/env";
import { toSingleLine } from "./utils/formateKey";

const credential = JSON.parse(
    Buffer.from(toSingleLine(env.google.serviceKey) ?? "", "base64").toString()
);

const getBudget = (): string => {
    return env.env == "production" ? "snappin" : env.env == "staging" ? "snappin_staging" : "snappin_dev"
}

export const storage = new Storage({
    projectId: env.google.projectId,
    credentials: {
        client_email: credential.client_email,
        client_id: credential.client_id,
        private_key: credential.private_key
    }
})

type UploadInvoiceProps = {
    userId?: string | null;
    fileName: string;
    buffer?: Buffer | null;
    contentType?: string | null;
};

type UploadInvoiceResponse = {
    fileId: string
}

export async function uploadInvoice({ userId, fileName, buffer, contentType = "application/octet-stream", }: UploadInvoiceProps): Promise<UploadInvoiceResponse | null> {
    if (!buffer) return null

    const objectPath = `user/${userId}/document/${fileName}`;

    const file = invoiceBucket.file(objectPath);

    await file.save(buffer, {
        resumable: false,
        metadata: {
            cacheControl: "private, max-age=0",
        },
        contentType: contentType ?? "",
    });

    // Return GCS URI (what Document AI wants)
    return {
        fileId: `user/${userId}/${fileName}`
    };
}

type RenameInvoiceProps = {
    oldFileId: string; // e.g. user/{userId}/{oldName}
    newFileName: string; // e.g. 2026_02_01_Amazon_INV-123.pdf
};

export async function renameInvoice({ oldFileId, newFileName, }: RenameInvoiceProps): Promise<{ fileId: string }> {
    const bucket = invoiceBucket;

    const oldFile = bucket.file(oldFileId);

    const pathParts = oldFileId.split("/");
    pathParts[pathParts.length - 1] = newFileName;

    const newFileId = pathParts.join("/");
    const newFile = bucket.file(newFileId);

    // Copy → delete (rename)
    await oldFile.copy(newFile);
    await oldFile.delete();

    return {
        fileId: newFileId
    };
}

export async function deleteFile(fileUrl: string) {
    try {
        await invoiceBucket.file(fileUrl).delete({
            ignoreNotFound: true // prevents crash if already deleted
        });
    } catch (error) {
        console.error("Failed to delete GCS file:", error);
    }
}


export const invoiceBucket = storage.bucket(getBudget())