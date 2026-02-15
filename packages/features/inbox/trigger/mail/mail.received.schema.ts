import { ZAppSlug } from "@snappin/shared/apps/app.enum";
import z from "zod";

export const ZMailNotificationSchema = z.object({
  provider: ZAppSlug,
  integrationKey: z.string(), // emailAddress (gmail) or subscriptionId (outlook)
  messageId: z.string().optional().nullable(),
  cursor: z.number().optional().nullable(), // historyId or deltaToken
});