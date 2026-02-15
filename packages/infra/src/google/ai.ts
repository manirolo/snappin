import { GoogleGenAI } from "@google/genai";
import { env } from "@snappin/env";
import { toSingleLine } from "./utils/formateKey";

const credential = JSON.parse(
  Buffer.from(toSingleLine(env.google.serviceKey) ?? "", "base64").toString()
);

export const genAi = new GoogleGenAI({
    vertexai: true,
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

export * from "@google/generative-ai"