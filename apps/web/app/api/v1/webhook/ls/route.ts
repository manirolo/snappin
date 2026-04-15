import { WebhookController } from "@snappin/features/webhook/webhook-controller";
import { LemonSqueezyWebhookVerifier } from "@snappin/features/webhook/ls/ls.webhook";
import { WebhookDispatcher } from '@snappin/features/webhook/webhook-dispatcher'
import { LSSubscriptionHandler } from '@snappin/features/billing/handler/subscription.handler'

export async function POST(request: Request): Promise<Response> {

    const subscription = new LSSubscriptionHandler()
    const lsController = new WebhookController(
        new LemonSqueezyWebhookVerifier(),
        new WebhookDispatcher({ subscription })
    );

    return lsController.webhook(request) as Promise<Response>
}
