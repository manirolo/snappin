import { Hono } from 'hono'
import { MailWebhookController } from './mail/mail.webhook.controller'
import { clerkController } from './clerk/clerk.webhook.controller'
import { MessagingController } from './messaging/messaging.webhook.controller'
// import { polarController } from './polar/polar.webhook.controller'
import { lsController } from "./ls/ls.webhook.controller"

const webhookRouter = new Hono()
const mailController = new MailWebhookController()
const messagingController = new MessagingController()

webhookRouter.post('/mail', (c) => mailController.handle(c))
webhookRouter.post('/clerk', (c) =>
    clerkController.webhook(c.req.raw, (body) => c.json(body))
)
webhookRouter.post("/ls", (c) => lsController.webhook(c.req.raw, (body) => c.json(body)))
webhookRouter.post('/messaging', (c) => messagingController.handle(c))
webhookRouter.get('/messaging', (c) => messagingController.verify(c))

export default webhookRouter