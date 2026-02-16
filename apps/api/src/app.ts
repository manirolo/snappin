import { serve } from '@hono/node-server'
import { env } from '@snappin/env'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { appRouter } from "@snappin/trpc/_root"
import { createContext } from "@snappin/trpc/_trpc"
import { logger } from 'hono/logger'
import router from './api/router'

const app = new Hono()

app.use("*", secureHeaders())

app.use(
  "*",
  cors({
    origin: [env.app.frontend_url],
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
  logger()
)

const API_VERSION = "v1"

app.all(`/api/${API_VERSION}/trpc/*`, async (c) => {

  return fetchRequestHandler({
    endpoint: `/api/${API_VERSION}/trpc`,
    req: c.req.raw,
    router: appRouter,
    createContext: () => createContext({ honoCtx: c }),
  })
})

app.route(`/api/${API_VERSION}`, router)
const port = Number(process.env.PORT) || 8080

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
