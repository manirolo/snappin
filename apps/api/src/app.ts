// import { Hono } from 'hono'
// import router from './api/route'
// import { secureHeaders } from 'hono/secure-headers'

// const app = new Hono()

// app.use("*", secureHeaders())

// app.get('/health', (c) => {
//   return c.json({ status: "ok" })
// })

// const API_VERSION = "v1"
// app.route(`/${API_VERSION}`, router)

// export default app 

import { Hono } from 'hono'

const app = new Hono()

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/hono",
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app