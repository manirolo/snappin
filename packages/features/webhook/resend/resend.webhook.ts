import { Webhook } from "svix"
import { IWebhookVerifier } from "../webhook-verifier";
import { RESEND_EVENT_MAP, ResendEventType } from "./types";
import { GenericWebhookEvent } from "../types";
import { env } from "@snappin/env";
import { SnappinError } from "@snappin/lib/error/snappin.error";
import { WebhookEventPayload } from "resend"

export class ResendWebhookVerifier implements IWebhookVerifier {
  async verify(req: Request): Promise<GenericWebhookEvent> {
    const payload = await req.text()
    const headers = {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!,
    };
    const wh = new Webhook(env.resend.webhookSecret);
    const event = await wh.verify(payload, headers) as WebhookEventPayload;

    const mapping = RESEND_EVENT_MAP[event.type as ResendEventType];
    if (!mapping) {
      throw new SnappinError(`Unhandled resend event: ${event.type}`, "webhook_unhandled_event");
    }

    return {
      provider: "resend",
      eventType: event.type,
      resource: mapping.resource,
      operation: mapping.operation,
      payload: event.data,
      raw: event,
    };
  }
}
