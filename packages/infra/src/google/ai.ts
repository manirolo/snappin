import { VertexAI } from "@google-cloud/vertexai";
import { env } from "@snappin/env";
import { toSingleLine } from "./utils/formateKey";

const credential = JSON.parse(
  Buffer.from(toSingleLine(env.google.serviceKey) ?? "", "base64").toString()
);

const vertex = new VertexAI({
    project: env.google.projectId,
    location: "us-central1",
    googleAuthOptions: {
        credentials: {
            client_id: credential.client_id,
            client_email: credential.client_email,
            private_key: credential.private_key
        }
    }
})

export const model = vertex.getGenerativeModel({
    model: "gemini-2.0-flash-lite"
})