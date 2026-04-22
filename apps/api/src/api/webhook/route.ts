import { Hono } from 'hono'
import { messagingWebhook } from './messaging/messing.webhook'

const webhookRouter = new Hono()

webhookRouter.post('/messaging', (c) => messagingWebhook.handle(c))
webhookRouter.get('/messaging', (c) => messagingWebhook.verify(c))

export default webhookRouter