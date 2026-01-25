import { router } from "./router/_router"
import { mergeRouters } from "./_trpc"

export const appRouter = mergeRouters(router)
export type AppRouter = typeof appRouter