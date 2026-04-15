import { createHmac, timingSafeEqual } from "crypto";
import { IWebhookVerifier } from "../webhook-verifier";
import { LS_EVENT_MAP, LSEventType, LSWebhookPayload } from "./types";
import { GenericWebhookEvent } from "../types";
import { env } from "@snappin/env";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export class LemonSqueezyWebhookVerifier implements IWebhookVerifier {
  async verify(req: Request): Promise<GenericWebhookEvent> {
    const payload = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      throw new SnappinError("Missing x-signature header", "webhook_invalid_signature");
    }

    const expected = createHmac("sha256", env.ls.webhookSecret)
      .update(payload)
      .digest("hex");

    const isValid = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );

    if (!isValid) {
      throw new SnappinError("Invalid Lemon Squeezy webhook signature", "webhook_invalid_signature");
    }

    const event = JSON.parse(payload) as LSWebhookPayload;
    const eventName = event.meta.event_name;

    const mapping = LS_EVENT_MAP[eventName as LSEventType];
    if (!mapping) {
      throw new SnappinError(`Unhandled Lemon Squeezy event: ${eventName}`, "webhook_unhandled_event");
    }

    return {
      provider: "lemonsqueezy",
      eventType: eventName,
      resource: mapping.resource,
      operation: mapping.operation,
      payload: event.data.attributes,
      raw: event,
    };
  }
}