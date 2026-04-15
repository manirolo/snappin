import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks'
import { IWebhookVerifier } from "../webhook-verifier";
import { POLAR_EVENT_MAP, PolarEventType } from "./types";
import { GenericWebhookEvent } from "../types";
import { env } from "@snappin/env";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export class PolarWebhookVerifier implements IWebhookVerifier {
    async verify(req: Request): Promise<GenericWebhookEvent> {
        const payload = await req.text()

        let event

        try {
            event = validateEvent(
                payload,                    // ← raw string, not req.body
                Object.fromEntries(req.headers.entries()),  // ← headers as plain object
                env.polar.webhookSecret ?? '',  // ← webhook secret, not accessToken
            )
        } catch (err) {
            if (err instanceof WebhookVerificationError) {
                throw new SnappinError("Invalid Polar webhook signature", "webhook_invalid_signature")
            }
            throw err
        }

        const mapping = POLAR_EVENT_MAP[event.type as PolarEventType]
        if (!mapping) {
            throw new SnappinError(`Unhandled Polar event: ${event.type}`, "webhook_unhandled_event")
        }

        return {
            provider: "polar",
            eventType: event.type,
            resource: mapping.resource,
            operation: mapping.operation,
            payload: event.data,
            raw: event,
        }
    }
}