import { Hono } from 'hono'
import { MailWebhookController } from './mail.webhook.controller'

const webhookRouter = new Hono()
const controller = new MailWebhookController()

webhookRouter.post('/mail', (c) => controller.handle(c))

export default webhookRouter