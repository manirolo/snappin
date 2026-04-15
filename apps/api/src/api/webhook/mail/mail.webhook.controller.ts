import type { Context } from 'hono'
import { AppSlug } from '@snappin/shared/apps/app.schema'
import { mailReceived } from "@snappin/features/accounts/trigger/mail/mail.received.task"
import { AnyEmailProvider, resolveProvider } from '@snappin/apps/lib/resolveProvider';
import { appMetadata } from '@snappin/apps/app.metadata';
import { MailNotificationSchema } from '@snappin/features/accounts/trigger/mail/mail.received.schema';

export class MailWebhookController {
  async handle(c: Context) {
    try {
      const appSlug = c.req.query("appSlug") as AppSlug | undefined;
      const validationToken = c.req.query("validationToken");

      if (validationToken) {
        return c.text(validationToken);
      }

      if (!appSlug) {
        return c.json({ ok: false });
      }

      const payload = await c.req.json();
      const appCategory = appMetadata[appSlug].category

      const app = resolveProvider(appCategory, appSlug) as AnyEmailProvider;

      const events = await app.normalizeNotification({ body: payload });

      if (!events.length) {
        console.info(`${appSlug} ping received`);
        return c.json({ ok: true });
      }

      for (const event of events) {
        mailReceived.trigger(event as unknown as MailNotificationSchema);
      }

      return c.json({ ok: true });
    } catch (err) {
      console.error("Mail webhook error:", err);
      return c.json({ ok: true });
    }
  }
}
