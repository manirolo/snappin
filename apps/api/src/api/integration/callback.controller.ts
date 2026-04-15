import { Context } from 'hono'
import { appRouter } from '@snappin/features/trpc/_root'
import { createContext } from '@snappin/features/trpc/_trpc'
import { env } from '@snappin/env'

export class CallbackController {
  async handle(c: Context) {
    const url = new URL(c.req.url)

    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (!code || !state) {
      return c.redirect(`${env.app_url}/integrations?error=invalid_oauth_callback`)
    }

    try {
      const ctx = await createContext({ honoCtx: c })

      const caller = appRouter.createCaller(ctx)

      const integration = await caller.integration.addIntegration({
        code,
        state,
        callbackUrl: c.req.url,
      })

      return c.redirect(integration.redirectAfter ?? "/dashboard")
    } catch (err) {
      console.error(err)
      return c.redirect(
        `${env.app_url}/connection-failed`
      )
    }
  }
}
