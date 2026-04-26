import { Hono } from 'hono'
import router from './api/route'
import { secureHeaders } from 'hono/secure-headers'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

app.use("*", secureHeaders())

app.get('/health', (c) => {
  return c.json({ status: "ok" })
})

const API_VERSION = "v1"
app.route(`/${API_VERSION}`, router)

export default app