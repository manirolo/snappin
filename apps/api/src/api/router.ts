import { Hono } from 'hono'
import integrationRouter from './integration/integration.route'
import webhookRouter from './webhook/route'

const router = new Hono()

const defaultRoutes = [
  {
    path: '/integration',
    route: integrationRouter
  },
  {
    path: '/webhook',
    route: webhookRouter
  },
]

defaultRoutes.forEach((route) => {
  router.route(route.path, route.route)
})

export default router
