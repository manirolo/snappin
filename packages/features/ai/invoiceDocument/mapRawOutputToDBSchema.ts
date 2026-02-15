import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import { model } from "@snappin/infra/google/ai";
import { mapRawOutputToDBSchemaInstruction } from "../instructions/mapRawOutputToDBSchema";
import { VendorResource } from "@snappin/shared/invoice/vendor.schema";
import { ExpenseField } from "@snappin/infra/aws/textract";

export async function mapRawOutputToDBSchema(rawOutput: ExpenseField[]):
    Promise<{
        invoice: InvoiceResource["invoice"] | null
        vendor: VendorResource | null,
        extraction: InvoiceResource["extraction"]
    }> {

    // AI instruction to map the Textract raw output to Schema
    const instruction = mapRawOutputToDBSchemaInstruction(rawOutput)

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: instruction }] }],
            generationConfig: { temperature: 0, topP: 1 }
        });

        const text = result.response.candidates?.[0]?.content?.parts
            ?.map(p => ("text" in p ? p.text : ""))
            .join("")
            .trim() ?? "";

        if (!text) {
            return {
                invoice: null,
                vendor: null,
                extraction: {
                    errorReason: "Empty model response",
                    raw: JSON.stringify(rawOutput, null, 2)
                }
            };
        }

        const parsed = JSON.parse(text);

        return {
            invoice: parsed.invoice ?? null,
            vendor: null,
            extraction: {
                errorReason: parsed.extraction?.errorReason ?? null,
                raw: JSON.stringify(rawOutput, null, 2)
            }
        };

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message :
            typeof err === "string"
                ? err
                : "JSON parse or model error";
        return {
            invoice: null,
            vendor: null,
            extraction: {
                errorReason: errorMessage ?? "JSON parse or model error",
                raw: JSON.stringify(rawOutput, null, 2)
            }
        };
    }
}
