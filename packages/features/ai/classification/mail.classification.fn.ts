import { genAi, ResponseSchema, Schema, SchemaType } from "@snappin/infra/google/ai"
import { EmailCategory, EmailCategoryValues } from "@snappin/shared/inbox/category"
import { AttachmentResource } from "@snappin/shared/inbox/mail.schema"
import { ZGeminiClassificationResponse } from "./mail.classification.schema"

type ClassifyThisMail = {
    subject?: string | null
    from?: string | null
    snippet?: string | null
    body?: string | null
    attachments?: AttachmentResource[] | null
}

type ClassifyThisMailResponse = {
    category: EmailCategory
    isRefund: boolean
}

const SYSTEM_INSTRUCTION = `
You are an email classification engine for a finance app.

Classify the email into EXACTLY ONE category:
- INVOICE = asks for payment
- RECEIPT = proof of completed payment
- OTHER = not related to money or expenses

Refund detection:
- A refund means money is returned, reversed, or credited back
- Keywords: refund, refunded, reversal, chargeback, credited back

Use subject, sender, snippet, body text, and attachment filenames.

Do not invent data.
`;

const classifyMailResponseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        category: {
            type: SchemaType.STRING,
            enum: [...EmailCategoryValues],

        } as Schema,
        isRefund: {
            type: SchemaType.BOOLEAN,
        },
    },
    required: ["category", "isRefund"],
};

export async function classifyThisMail(payload: ClassifyThisMail): Promise<ClassifyThisMailResponse> {

    const response = await genAi.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: [JSON.stringify(payload)],
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseSchema: classifyMailResponseSchema,
            responseMimeType: "application/json"
        }
    })
    const text = response.text

    if (!text) {
        return { category: "OTHER", isRefund: false }
    }
    const parsed = JSON.parse(text)
    const validated = ZGeminiClassificationResponse.parse(parsed)
    return validated
}
