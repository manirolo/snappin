import { UserHandler } from '@snappin/features/user/handler/user.handler'
import { OrganizationHandler } from '@snappin/features/organization/handler/organization.handler'
import { WebhookDispatcher } from '@snappin/features/webhook/webhook-dispatcher'
import { WebhookController } from '@snappin/features/webhook/webhook-controller'
import { ClerkWebhookVerifier } from '@snappin/features/webhook/clerk/clerk.webhook'

const user = new UserHandler();
const organization = new OrganizationHandler();

const dispatcher = new WebhookDispatcher({ user, organization });

export const clerkController = new WebhookController(
    new ClerkWebhookVerifier(),
    dispatcher
);
