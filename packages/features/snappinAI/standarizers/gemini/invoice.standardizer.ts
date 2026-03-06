import { model, generateText, Output } from "@snappin/infra/google/ai";
import { TInvoiceDocumentAI, ZInvoiceDocumentAI } from "./invoice.standardizer.schema"
import { SnappinError } from "@snappin/lib/error/snappin.error"
import { AnalyzeEngine, ZAnalyzeEngine } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
import { InvoiceStandardizer, StandardizerInput, StandardizerService } from "../standardizer.service";
import { logger } from "@snappin/lib/logger";

/**
 * Gemini LLM prompt for normalizing raw textract output to DB model
 * 
 * It's not optimized one need to review sometimes 
 * TODO: improve the prompt
 */

const prompt = `
ROLE
Invoice normalizer.

INPUT
Filtered Textract data

TASK
Map AWS Textract OCR output into ONE structured invoice JSON.

STRICT RULES
- JSON only.
- Match schema exactly.
- No invention.
- Unknown → null.
- No empty strings or empty arrays.

CURRENCY
- Use explicit symbol or ISO code.
- Return ISO code

MONEY
- Detect any currency amount (₹, $, €, £, etc.).
- Remove currency symbols and thousand separators.
- Convert to minor units (multiply by 100).
- Remove decimal points completely.
- Output as an integer.

TAX
- Use explicit tax type if present in line items or other fields.

LINE ITEMS
- Include only explicit purchasable items.
- Do not infer from totals.
- Do not confuse unitPrice, subTotal, total.

DATES
- Use only explicit dates.
- Format: YYYY-MM-DDTHH:mm:ssZ.
- If time missing → 00:00:00Z.
- Ambiguous → null.

GUARDS
- Never swap subtotal and total.
- Never treat unit price as total price.

Return ONE JSON object.
`;


export class GeminiInvoiceStandardizer implements InvoiceStandardizer<TInvoiceDocumentAI> {

  async standardize(input: StandardizerInput) {
    // We use gemini 2.0 flash lite for low cost service
    // Don't change temperature. It must be always 0
    // You can control maxOutputTokens by adjusting it
    const result = await generateText({
      model: model("gemini-2.0-flash-lite"),
      temperature: 0,
      topP: 0.1,
      maxOutputTokens: 2048,
      system: prompt,
      prompt: JSON.stringify(input),
      experimental_output: Output.object({ schema: ZInvoiceDocumentAI }),
    });

    // experimental_output gives you a typed, already-validated object
    const output = result.output;

    if (!output) {
      logger.error("Gemini raw text when output was null:", result.text);
      logger.error("Finish reason:", result.finishReason);
      throw new SnappinError(
        "Gemini returned empty response",
        "llm_empty_response",
        { analyzeEngine: ZAnalyzeEngine.options[0] }
      );
    }

    // No need for JSON.parse or ZInvoiceDocumentAI.parse — already done by the SDK
    return output;
  }
}

const geminiInvoiceStandardizer = new GeminiInvoiceStandardizer();

export const invoiceStandardizer = new StandardizerService(geminiInvoiceStandardizer, AnalyzeEngine.GEMINI, logger);