import type { Context } from 'hono'
import { AppSlug } from '@snappin/shared/apps/app.enum'
import { mailReceived } from "@snappin/features/inbox/trigger/mail/mail.received.task"
import { EmailAppsStore } from '@snappin/apps/appRegistry';

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

      const app = EmailAppsStore[appSlug];

      const events = await app.normalizeNotification({ body: payload });

      if (!events.length) {
        console.info(`${appSlug} ping received`);
        return c.json({ ok: true });
      }

      for (const event of events) {
        mailReceived.trigger(event);
      }

      return c.json({ ok: true });
    } catch (err) {
      console.error("Mail webhook error:", err);
      return c.json({ ok: true });
    }
  }
}
