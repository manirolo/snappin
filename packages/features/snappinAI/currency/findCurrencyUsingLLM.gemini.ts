import { model, generateText, Output } from "@snappin/infra/google/ai";
import { NormalizedField, NormalizedLineItem } from "../../../lib/normalizers/normalizer.service";
import { ZCurrencyOnlyResponse } from "./findCurrencyUsingLLM.gemini.schema";

const findOrGuessCurrencyPrompt = `
ROLE
Deterministic currency fallback resolver (final attempt).

TASK
Return invoice currency using ONLY explicit geographic signals
(country name or postal address text).

RULES (STRICT ORDER)
1. Identify country from any field.
2. If EXACTLY one confident country → map to currency table.
3. If none, multiple, weak, or indirect → null.

CONSTRAINTS
- Ignore all non-geographic signals.
- No symbols, no inference from language, tax, numbers, layout, or totals.
- Output ISO 4217 (3-letter, uppercase) or null only.

OUTPUT
JSON only:
{ "currency": "XXX" } or { "currency": null }
`;


type GroupedTextractFields = {
    vendor: NormalizedField[]
    receiver: NormalizedField[]
    invoice: NormalizedField[],
    lineItems: NormalizedLineItem[] | null
}

export async function findOrGuessCurrency(input: GroupedTextractFields) {
    const result = await generateText({
        model: model("gemini-2.0-flash-lite"),
        temperature: 0,
        topP: 0.1,
        maxOutputTokens: 2048,
        system: findOrGuessCurrencyPrompt,
        prompt: JSON.stringify(input),
        experimental_output: Output.object({ schema: ZCurrencyOnlyResponse }),
    });

    const output = result.output
    
    if (!output) {
        return;
    }

    return output;
}
