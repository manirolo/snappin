import { env } from "@snappin/env";
import { Context } from "hono";
import { whatsappClient } from "@snappin/apps/whatsapp/whatsapp.client";
import { processEvent } from "@snappin/features/mobileScanners/trigger/message.received.task";
import { createHmac } from "crypto"

export class MessagingController {
    async verify(c: Context) {
        const mode = c.req.query("hub.mode");
        const token = c.req.query("hub.verify_token");
        const challenge = c.req.query("hub.challenge");

        if (mode === "subscribe" && token === env.whatsapp.verifyToken) {
            return c.text(challenge ?? "", 200);
        }

        return c.text("Forbidden", 403);
    }

    private verifySignature(body: string, signature: string | undefined): boolean {
        if (!signature) return false
        const expected = "sha256=" + createHmac("sha256", env.whatsapp.appSecret!)
            .update(body).digest("hex")
        return signature === expected
    }

    async handle(c: Context) {
        const rawBody = await c.req.text()
        const signature = c.req.header("x-hub-signature-256")
        const isValid = this.verifySignature(rawBody, signature)
        if (!isValid) return c.json({ error: "Invalid signature" }, 401)

        const payload = JSON.parse(rawBody)
        const events = await whatsappClient.normalizeNotification(payload)

        Promise.all(events.map(event => processEvent(event))).catch((err) => {
            console.error("[handle] processEvent error:", err)
        })

        return c.json({ ok: true })
    }
}