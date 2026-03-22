import { WebhookDispatcher } from "./webhook-dispatcher";
import { IWebhookVerifier } from "./webhook-verifier";

export class WebhookController {
    constructor(
        private readonly verifier: IWebhookVerifier,
        private readonly dispatcher: WebhookDispatcher
    ) { }

    async webhook<TResponse>(
        req: unknown,
        respond: (body: unknown, status?: number) => TResponse
    ): Promise<TResponse> {
        try {
            const event = await this.verifier.verify(req);
            return await this.dispatcher.dispatch(event).then(() => {
                return respond({ ok: true }, 200);
            }).catch((err) => respond({ ok: false, err: err instanceof Error ? err.message : "Unknown" }, 400));
        } catch (err) {
            return respond(
                { ok: false, error: err instanceof Error ? err.message : "Unknown" },
                400
            );
        }
    }
}
