import { AppSlug } from "@snappin/shared/apps/app.enum";
import { NormalizeNotificationProps, NormalizeNotificationResponse } from "../../appRegistry.interface";

export async function normalizeNotification({ body }: NormalizeNotificationProps<AppSlug.GMAIL>): Promise<NormalizeNotificationResponse> {
  const message = body?.message;
  if (!message?.data) return [];

  const decoded = JSON.parse(
    Buffer.from(message.data, "base64").toString("utf-8")
  );

  return [
    {
      provider: AppSlug.GMAIL,
      integrationKey: decoded.emailAddress,
      cursor: decoded.historyId,
      messageId: null,
    },
  ];
}
