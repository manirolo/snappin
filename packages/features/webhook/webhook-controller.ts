import { WebhookDispatcher } from "./webhook-dispatcher";
import { IWebhookVerifier } from "./webhook-verifier";

export class WebhookController {
    constructor(
        private readonly verifier: IWebhookVerifier,
        private readonly dispatcher: WebhookDispatcher
    ) { }

    async webhook(req: Request): Promise<Response> {
        try {
            const event = await this.verifier.verify(req);
            await this.dispatcher.dispatch(event);
            return Response.json({ ok: true }, { status: 200 });
        } catch (err) {
            return Response.json(
                { ok: false, error: err instanceof Error ? err.message : "Unknown" },
                { status: 400 }
            );
        }
    }
}