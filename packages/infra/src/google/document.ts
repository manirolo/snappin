import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { env } from "@snappin/env";
import { toSingleLine } from "./utils/formateKey";

const credential = JSON.parse(
    Buffer.from(toSingleLine(env.google.serviceKey) ?? "", "base64").toString()
);

export const documentAI = new DocumentProcessorServiceClient({
    projectId: credential.project_id,
    credentials: {
        client_email: credential.client_email,
        private_key: credential.private_key,
    },
});

export { protos } from "@google-cloud/documentai"