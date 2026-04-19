import { Hono } from 'hono'
import webhookRouter from './webhook/route'

const router = new Hono()

const defaultRoutes = [
    {
        path: '/webhook',
        route: webhookRouter
    },
]

defaultRoutes.forEach((route) => {
    router.route(route.path, route.route)
})

export default router