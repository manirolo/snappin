import { env } from "@snappin/env";
import { protos } from "@snappin/infra/google/document";

export async function processInvoiceDocument(buffer?: Buffer, mimeType?: string) {
    const { documentAI } = await import("@snappin/infra/google/document");

    const name = `projects/${env.google.projectId}/locations/us/processors/${env.google.invoiceExtractorId}`;

    let request: protos.google.cloud.documentai.v1.IProcessRequest = { name }

    request.rawDocument = {
        content: buffer?.toString("base64"),
        mimeType: mimeType
    }

    const [result] = await documentAI.processDocument(request);


    return result.document;
}
