import { initTRPC, TRPCError } from "@trpc/server"
import { getAuth } from "@hono/clerk-auth"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"
import type { Context as HonoContext } from "hono"

type CreateContextProps = {
    userId?: string | null,
    orgId?: string | null,
}

export type ContextProps = CreateContextProps & {
    db: typeof db
}

export type InternalTRPCContext = {
    db: typeof db
}

/**
 * This helper generates the "internals" for a tRPC context
 */
const createInnerTRPCContext = (opts: CreateContextProps) => {
    return {
        ...opts,
        db
    }
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts: {
    honoCtx: HonoContext
}) => {
    const auth = getAuth(opts.honoCtx)

    await connectDB()

    return createInnerTRPCContext({
        userId: auth?.userId ?? null,
        orgId: auth?.orgId ?? null,
    })
}

export type Context = Awaited<ReturnType<typeof createContext>>

export const createInternalTRPCContext = async (): Promise<InternalTRPCContext> => {
    await connectDB();
    return {
        db,
    }
}

const t = initTRPC
    .context<ContextProps>()
    .create()

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return opts.next({
        ctx: {
            ...ctx,
            userId: ctx.userId
        }
    })
})

/**
 * This is how you create new routers and sub routers in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
