import { generateText, model, Output } from "@snappin/infra/google/ai"
import { EmailCategory, EmailCategoryValues } from "@snappin/shared/inbox/category"
import { AttachmentResource } from "@snappin/shared/inbox/mail.schema"
import { z } from "zod";

export const ZGeminiClassificationResponse = z.object({
  category: z.enum(EmailCategoryValues),
  isRefund: z.boolean(),
});

export type ZGeminiClassificationResponse =
  z.infer<typeof ZGeminiClassificationResponse>;

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

const ZClassifyThisMailResponse = z.object({
    category: z.enum(EmailCategoryValues),
    isRefund: z.boolean(),
});

const SYSTEM_INSTRUCTION = `
You are an email classification engine for a finance app.

Classify the email into EXACTLY ONE category:
- INVOICE
- RECEIPT
- OTHER

Refund detection:
- A refund means money is returned, reversed, or credited back
- Keywords: refund, refunded, reversal, chargeback, credited back

Privacy & security rules (STRICT):
- If the email contains OTP, verification code, login code, 2FA, or security code → classify as OTHER immediately, do not read or process the code
- If the email appears to be personal (family, friends, dating, social) → classify as OTHER immediately
- If the email contains passwords, private keys, or sensitive credentials → classify as OTHER immediately, do not read or process the content
- Never extract, repeat, or process any OTP, verification code, or personal information found in the email

Use subject, sender, snippet, body text, and attachment filenames.

Do not invent data.
`;

export async function classifyThisMail(payload: ClassifyThisMail): Promise<ClassifyThisMailResponse> {

    const result = await generateText({
        model: model("gemini-2.0-flash-lite"),
        temperature: 0,
        topP: 0.1,
        maxOutputTokens: 2048,
        system: SYSTEM_INSTRUCTION,
        prompt: JSON.stringify(payload),
        experimental_output: Output.object({ schema: ZClassifyThisMailResponse }),
    });

    const output = result.output;

    if (!output) {
        console.warn("No output from classification engine. Returns standard output.")
        return { category: "OTHER", isRefund: false };
    }

    return output;
}
