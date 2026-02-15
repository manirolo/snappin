import { z } from "zod";
import { EmailCategoryValues } from "@snappin/shared/inbox/category";

export const ZGeminiClassificationResponse = z.object({
  category: z.enum(EmailCategoryValues),
  isRefund: z.boolean(),
});

export type ZGeminiClassificationResponse =
  z.infer<typeof ZGeminiClassificationResponse>;
