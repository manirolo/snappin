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
    userId: string;
    fileName: string;
    buffer: Buffer;
    contentType?: string;
};

export async function uploadInvoice({ userId, fileName, buffer, contentType = "application/octet-stream", }: UploadInvoiceProps): Promise<string> {
    const objectPath = `user/${userId}/${Date.now()}-${fileName}`;

    const file = invoiceBucket.file(objectPath);

    await file.save(buffer, {
        contentType,
        resumable: false, 
        metadata: {
            cacheControl: "private, max-age=0",
        },
    });

    // Return GCS URI (what Document AI wants)
    return `gs://${invoiceBucket.name}/${objectPath}`;
}

export const invoiceBucket = storage.bucket(getBudget())