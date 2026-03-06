import { model, generateText, Output } from "@snappin/infra/google/ai";
import { TVendorAI, ZVendorAI } from "./vendor.standardizer.gemini.schema"
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
Vendor normalizer.

INPUT
Filtered Textract vendor data .

TASK
Extract ONE vendor object matching the provided vendor schema.

STRICT RULES
- JSON only.
- Match schema exactly.
- Unknown → null.
- No guessing or inference.

SCOPE
- Extract the vendor/supplier issuing the invoice, not the customer.

IDENTIFICATION
- Prefer taxId or businessRegistrationId if explicit.
- Do not guess IDs.

CONTACT
- Extract explicit email, phone, website only.
- Do not derive from unrelated text.

NAME RULES
- legalName = full legal/business name exactly as written.
- name = short display name derived from legalName.
- Remove legal suffixes (LLP, Pvt Ltd, Private Limited, Inc, Ltd, LLC, Corporation).
- Maximum 2–3 meaningful words.
- First letter capitalized.
- No special characters unless part of brand.
- If legalName is null → name = null.

ADDRESS
- Extract full address and split into state, country, zipCode only if clearly present.
- Do not infer missing parts.

TAX
- Extract taxId and taxType only if explicitly stated.

SYSTEM FIELDS
- Do not generate _id, userId, orgId.
- Do not generate createdAt or updatedAt.

Return ONE JSON object.
`;



export class GeminiVendorStandardizer implements InvoiceStandardizer<TVendorAI> {

    async standardize(vendor: StandardizerInput) {
        // We use gemini 2.0 flash lite for low cost service
        // Don't change temperature. It must be always 0
        // You can control maxOutputTokens by adjusting it
        const result = await generateText({
            model: model("gemini-2.0-flash-lite"),
            temperature: 0,
            topP: 0.1,
            maxOutputTokens: 2048,
            system: prompt,
            prompt: JSON.stringify(vendor),
            experimental_output: Output.object({ schema: ZVendorAI }),
        });

        // experimental_output gives you a typed, already-validated object
        const output = result.output;

        if (!output) {
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
const geminiVendorStandardizer = new GeminiVendorStandardizer();
export const vendorStandardizer = new StandardizerService(geminiVendorStandardizer, AnalyzeEngine.GEMINI, logger);
