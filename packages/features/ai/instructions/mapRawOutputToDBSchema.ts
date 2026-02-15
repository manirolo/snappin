import { ExpenseField } from "@snappin/infra/aws/textract";

export const INVOICE_SCHEMA_FOR_AI = `{
  "invoice": {
    "id": "string | null",
    "recipient": {
      "name": "string | null",
      "phone": "string | null",
      "email": "string | null",
      "taxId": "string | null",
      "taxType": "string | null",
      "address": "string | null",
      "state": "string | null",
      "country": "string | null",
      "zipCode": "string | null"
    },
    "date": "YYYY-MM-DD | null",
    "total": "number | null",
    "totalInDecimal": "number | null",
    "tax": "number | null",
    "currency": "ISO-4217 | null",
    "lineItems": [
      {
        "item": "string | null",
        "code": "string | null",
        "description": "string | null",
        "quantity": "number | null",
        "unitPrice": "number | null",
        "price": "number | null",
        "totalPrice": "number | null",
        "tax": "number | null",
        "discount": "string | null"
      }
    ]
  },
  "vendor": {
    "name": string | null,
    "address": string | null,
    "phone": string | null,
    "url": string | null,
    "taxId": string | null,
    "emailId": string | null,
  }
}
`;

export const mapRawOutputToDBSchemaInstruction = (rawOutput: ExpenseField[]) => `
You are a strict invoice data mapping engine.

Rules:
- Do NOT guess or hallucinate values
- Use null if missing
- Do NOT calculate totals, taxes, or prices
- Extract line items ONLY from tables
- Output ONLY valid JSON
- No explanations, no markdowns or extra text

Schema:
${INVOICE_SCHEMA_FOR_AI}

Raw Textract Output (JSON):
${JSON.stringify(rawOutput, null, 2)}
`;