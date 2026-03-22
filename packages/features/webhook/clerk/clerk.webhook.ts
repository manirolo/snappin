import { Webhook } from "svix"
import { WebhookEvent } from "@clerk/backend";
import { IWebhookVerifier } from "../webhook-verifier";
import { CLERK_EVENT_MAP, ClerkEventType } from "./types";
import { GenericWebhookEvent } from "../types";
import { env } from "@snappin/env";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export class ClerkWebhookVerifier implements IWebhookVerifier {
  async verify(req: Request): Promise<GenericWebhookEvent> {
    const payload = await req.text()
    const headers = {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!,
    };
    const wh = new Webhook(env.clerk.webhookSecretKey);
    const event = await wh.verify(payload, headers) as WebhookEvent;

    const mapping = CLERK_EVENT_MAP[event.type as ClerkEventType];
    if (!mapping) {
      throw new SnappinError(`Unhandled Clerk event: ${event.type}`, "webhook_unhandled_event");
    }

    return {
      provider: "clerk",
      eventType: event.type,
      resource: mapping.resource,
      operation: mapping.operation,
      payload: event.data,
      raw: event,
    };
  }
}
