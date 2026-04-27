import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import router from './api/route'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

app.use("*", secureHeaders())

app.get('/health', (c) => {
  return c.json({ status: "ok" })
})

const API_VERSION = "v1"

app.route(`/${API_VERSION}`, router)

serve({
  fetch: app.fetch,
  port: 8080
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app