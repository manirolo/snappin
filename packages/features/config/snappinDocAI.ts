import { env } from "@snappin/env";
import { SnappinDocAI } from "@snappinhq/doc-ai";

export const snappinDocAI = new SnappinDocAI({
    textract: {
        region: env.aws.region,
        credentials: {
            accessKeyId: env.aws.accessKeyId,
            secretAccessKey: env.aws.secretAccessKey
        }
    },
    vertex: {
        projectId: env.google.projectId,
        location: env.google.region,
        credentials: env.google.serviceKey
    }
})