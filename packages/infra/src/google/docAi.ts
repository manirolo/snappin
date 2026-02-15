import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { env } from "@snappin/env";
import { toSingleLine } from "./utils/formateKey";
import { fileTypeFromBuffer } from "file-type";

const credential = JSON.parse(
    Buffer.from(toSingleLine(env.google.serviceKey), "base64").toString()
);

export const documentAiClient = new DocumentProcessorServiceClient({
    credentials: {
        client_email: credential.client_email,
        private_key: credential.private_key,
    },
    projectId: env.google.projectId,
});

const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
]);

export async function processDocument(
    buffer: Buffer
) {
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected) {
        throw new Error("Unable to detect document type");
    }

    if (!SUPPORTED_MIME_TYPES.has(detected.mime)) {
        throw new Error(
            `Unsupported document type: ${detected.mime}`
        );
    }

    const name = `projects/${env.google.projectId}/locations/us/processors/${env.google.invoiceExtractorId}`;

    const [result] = await documentAiClient.processDocument({
        name,
        rawDocument: {
            content: buffer.toString("base64"),
            mimeType: detected.mime,
        },
    });

    return result.document;
}

export * from "@google-cloud/documentai"