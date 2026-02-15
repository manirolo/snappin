import { Hono } from 'hono'
import { CallbackController } from './callback.controller'

const callbackRouter = new Hono()
const controller = new CallbackController()

callbackRouter.get('/callback', (c) => controller.handle(c))

export default callbackRouter
