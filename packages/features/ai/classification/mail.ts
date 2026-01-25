import { model } from "@snappin/infra/google/ai"
import { EmailCategory, EmailCategoryValues } from "@snappin/shared/inbox/category"

type Attachment = {
    fileName: string
    mimeType: string
}

type ClassifyThisMail = {
    subject?: string | null
    from?: string | null
    snippet?: string | null
    bodyText?: string
    attachments?: Attachment[] | null
}

type ClassifyThisMailResponse = {
    category: EmailCategory
    isRefund: boolean
}

const SYSTEM_INSTRUCTION = `
You are an email classification engine for a finance app.

Classify the email into EXACTLY ONE category from this list:
INVOICE, RECEIPT, OTHER.

Refund detection:
- A refund means money is returned, reversed, or credited back.
- Keywords include: refund, refunded, reversal, chargeback, credited back.

Rules:
- INVOICE = asks for payment
- RECEIPT = proof of completed payment
- OTHER = not related to money or expenses

Use subject, sender, snippet, body text, and attachment filenames.

IMPORTANT OUTPUT RULES:
- Output format: CATEGORY|REFUND or CATEGORY|NO_REFUND
- CATEGORY must be one of:
  INVOICE, RECEIPT, OTHER
- REFUND means the email indicates a refund or reversal
- NO_REFUND means no refund
- No JSON
- No quotes
- No markdown
- No explanations
- No extra text

Valid outputs (examples):
INVOICE|NO_REFUND
RECEIPT|REFUND
OTHER|NO_REFUND
`;

export async function classifyThisMail(payload: ClassifyThisMail): Promise<ClassifyThisMailResponse> {

    const response = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    { text: SYSTEM_INSTRUCTION },
                    { text: JSON.stringify(payload) }
                ]
            }
        ]
    })
    const candidates = response.response.candidates

    if (!candidates || candidates.length === 0) return { category: "OTHER", isRefund: false }

    const parts = candidates[0]?.content?.parts

    if (!parts || parts.length === 0) return { category: "OTHER", isRefund: false }

    const text = parts
        .map(p => ("text" in p ? p.text : ""))
        .join("")
        .trim()
        .toUpperCase()

    if (!text) {
        return { category: "OTHER", isRefund: false }
    }

    const [categoryRaw, refundRaw] = text.split("|")

    const category = Object.values(EmailCategoryValues).includes(
        categoryRaw as EmailCategory
    )
        ? (categoryRaw as EmailCategory)
        : "OTHER"

    const isRefund = refundRaw === "REFUND"

    return {
        category,
        isRefund
    }
}
