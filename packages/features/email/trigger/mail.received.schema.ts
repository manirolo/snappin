import z from "zod";

export const ZMailNotificationSchema = z.object({
    emailId: z.string(),
    messageId: z.string(),
    from: z.string(),
    subject: z.string()
});

export type MailNotificationSchema = z.infer<typeof ZMailNotificationSchema>