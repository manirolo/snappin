import { createVertex } from "@ai-sdk/google-vertex";
import { env } from "@snappin/env";
import { toSingleLine } from "./utils/formateKey";

const credential = JSON.parse(
  Buffer.from(toSingleLine(env.google.serviceKey) ?? "", "base64").toString()
);

export const model = createVertex({
  project: env.google.projectId,
  location: "us-central1",
  googleAuthOptions: {
    credentials: {
      client_email: credential.client_email,
      private_key: credential.private_key,
    },
  },
});

export * from "ai"