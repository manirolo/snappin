import { ZEmailAppSlug } from "@snappin/shared/apps/app.schema";
import z from "zod";

export const ZMailNotificationSchema = z.object({
  provider: ZEmailAppSlug,
  integrationKey: z.string(), // emailAddress (gmail) or subscriptionId (outlook)
  messageId: z.string().optional().nullable(),
  cursor: z.number().optional().nullable(), // historyId or deltaToken
});

export type MailNotificationSchema = z.infer<typeof ZMailNotificationSchema>