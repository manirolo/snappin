import { NextRequest } from "next/server";
import { EmailHandler } from '@snappin/features/email/handler/email'
import { WebhookDispatcher } from '@snappin/features/webhook/webhook-dispatcher'
import { WebhookController } from '@snappin/features/webhook/webhook-controller'
import { ResendWebhookVerifier } from '@snappin/features/webhook/resend/resend.webhook'

export async function POST(request: NextRequest) {
    const email = new EmailHandler()
    const dispatcher = new WebhookDispatcher({ email });

    const resendController = new WebhookController(
        new ResendWebhookVerifier(),
        dispatcher
    );

    return resendController.webhook(request) as Promise<Response>
}