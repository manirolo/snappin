import { createTRPCRouter, protectedProcedure } from "../../_trpc"
import { ZCreateNewOAuthSession } from "./createOAuthSession.schema"
import { createNewOAuthSession } from "./createOAuthSession.handler"
import { AddIntegration } from "./addIntegration.handler"
import { ZAddIntegration } from "./addIntegration.schema"
import { ZGetIntegration } from "./getIntegration.schema"
import { GetIntegration } from "./getIntegration.handler"
import { ZRemoveIntegration } from "./removeIntegration.schema"
import { RemoveIntegration } from "./removeIntegration.handler"
import { ZUpdateIntegration } from "./updateIntegration.schema"
import { UpdateIntegration } from "./updateIntegration.handler"

export const integrationRouter = createTRPCRouter({
    createOAuthSession: protectedProcedure.input(ZCreateNewOAuthSession).mutation(async (opts) => {
        return createNewOAuthSession(opts)
    }),
    addIntegration: protectedProcedure.input(ZAddIntegration).mutation(async (opts) => {
        return AddIntegration(opts)
    }),
    getIntegration: protectedProcedure.input(ZGetIntegration).query(async (opts) => {
        return GetIntegration(opts)
    }),
    updateIntegration: protectedProcedure.input(ZUpdateIntegration).mutation(async (opts) => {
        return UpdateIntegration(opts)
    }),
    removeIntegration: protectedProcedure.input(ZRemoveIntegration).mutation(async (opts) => {
        return RemoveIntegration(opts)
    })
})