import { genAi } from "@snappin/infra/google/ai";
import { invoiceResponseSchema, TGeminiInvoiceResponse, ZGeminiInvoiceResponse } from "./gemini.standardizer.schema";
import { SnappinError } from "@snappin/lib/error/snappin.error"
import { ZAnalyzeEngine } from "@snappin/shared/invoice/invoice.schema";
import { InvoiceStandardizer, StandardizerInput } from "./standardizer.service";

/**
 * Gemini LLM prompt for normalizing raw textract output to DB model
 * 
 * It's not optimized one need to review sometimes 
 * TODO: improve the prompt
 */
const prompt = `
ROLE
Deterministic invoice normalizer.

TASK
Convert AWS Textract OCR output into ONE structured invoice JSON.

OUTPUT RULES
- JSON only. No text, no markdown.
- Must match response schema exactly.
- Never invent values.
- Use null for unknown/uncertain.
- No empty strings or empty arrays.

DATA QUALITY
- Fields may be duplicated, partial, misaligned, or conflicting.
- Prefer explicit > implied.
- Conflicts → strongest signal or null.

VENDOR ALIAS NAME
- Generate a short, commonly used alias for the vendor.
- Alias MUST be non-empty
- If unsure, return the first meaningful word from vendor name
- Capitalize first letter others lowercase

DOCUMENT TYPE
invoice | receipt | credit_note
- payment completed → receipt
- due date or balance due → invoice

PAYMENT STATUS
paid | unpaid | partial | refunded
- partial = paid < total

CURRENCY
- Use explicit symbol or ISO code.
- Else infer from:
  1) vendor country
  2) customer country
- If inferred or conflicting → null + manual review.

MONEY
- Convert ALL amounts to minor units (10.55 → 1055).
- Includes totals, taxes, shipping, paid, balance, line items.
- If precision unclear → null.

TAX
- Use explicit tax type if present in line items or other fields.
- Else infer by vendor country:
  IN → GST | US → Sales Tax | EU/UK → VAT
- taxAmount and taxRate ONLY if explicit.

LINE ITEMS
- Include ONLY explicit purchasable items.
- Do NOT derive from totals.
- Prices only if explicit or clearly derived.

DATES
- Accept ONLY explicit dates.
- Normalize to ISO 8601 timestamp: YYYY-MM-DDTHH:mm:ssZ
- If time missing → assume 00:00:00Z
- Ambiguous meaning → null.

SUBSCRIPTION
- Populate if recurring intent is EXPLICITLY stated anywhere, including
  plan names, line items, or descriptions with billing periods
  (e.g. Monthly, Yearly, per month, per year, per day, "From X to Y").
- Billing period labels in line items are explicit signals, not inference.
- isRecurring = "true" if ANY explicit recurring signal exists, else null.
- frequency ONLY if explicitly stated:
  day | weekly | monthly | yearly
- nextBillingDate:
  use the END date of an explicit billing range ("From X to Y"),
  else ONLY if explicitly stated elsewhere.
- Do NOT infer from totals, currency, vendor type, or prices alone.

GUARDS
- Never swap subtotal and total.
- Never treat unit price as total price.

MANUAL REVIEW = true if:
- Currency or tax inferred
- Conflicting totals or currencies
- Receipt has due date
- Non-reconciling derived values
- Any critical ambiguity
Else false.

Return ONE JSON object.
`;


export class GeminiInvoiceStandardizer implements InvoiceStandardizer<TGeminiInvoiceResponse> {

  async standardize(input: StandardizerInput) {
    // We use gemini 2.0 flash lite for low cost service
    // Don't change temperature. It must be always 0
    // You can control maxOutputTokens by adjusting it
    const result = await genAi.models.generateContent({
      model: "gemini-2.0-flash-lite",
      config: {
        temperature: 0,
        topP: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: invoiceResponseSchema,
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              text: `
              STRUCTURED_TEXTRACT_FIELDS_JSON
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
      throw new SnappinError("Gemini returned empty response", "llm_empty_response", { analyzeEngine: ZAnalyzeEngine.options[0] });
    }

    const parsed = JSON.parse(responseText);
    const validated = ZGeminiInvoiceResponse.parse(parsed);

    return validated;
  }
}
