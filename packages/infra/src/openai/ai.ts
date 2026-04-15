import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@snappin/env";


export const openai = createOpenAI({
  apiKey: env.openai.apiKey,
});

// Drop-in model for invoice standardization
// gpt-4o-mini: best balance of cost, speed, and accuracy for structured extraction
export const model = openai("gpt-4o-mini");

export * from "ai";