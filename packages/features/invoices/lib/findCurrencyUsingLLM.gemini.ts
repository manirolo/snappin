import { genAi, ResponseSchema, SchemaType } from "@snappin/infra/google/ai";
import { NormalizedField, NormalizedLineItem } from "./normalizers/normalizer.service";
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

export const currencyOnlySchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    required: ["currency"],
    properties: {
        currency: {
            type: SchemaType.STRING,
            nullable: true,
            description: "ISO 4217 currency code (e.g. INR, USD, EUR) or null"
        }
    }
};


type GroupedTextractFields = {
    vendor: NormalizedField[]
    receiver: NormalizedField[]
    invoice: NormalizedField[],
    lineItems: NormalizedLineItem[] | null
}

export async function findOrGuessCurrency(
    input: GroupedTextractFields
) {
    const result = await genAi.models.generateContent({
        model: "gemini-2.0-flash-lite",
        config: {
            temperature: 0,
            topP: 0.1,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
            responseSchema: currencyOnlySchema,
        },
        contents: [
            {
                role: "user",
                parts: [
                    { text: findOrGuessCurrencyPrompt },
                    {
                        text: `STRUCTURED_TEXTRACT_FIELDS_JSON
                            ${JSON.stringify({
                            vendor: input.vendor,
                            receiver: input.receiver,
                            invoice: input.invoice,
                            lineItems: input.lineItems
                        },
                            null,
                            2
                        )}
                        `,
                    },
                ],
            },
        ],
    });

    const responseText = result.text

    if (!responseText) {
        throw new Error("Gemini returned empty response");
    }
    const parsed = JSON.parse(responseText);
    const validated = ZCurrencyOnlyResponse.parse(parsed);

    return validated;
}
