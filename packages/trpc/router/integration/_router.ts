import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../_trpc"
import { ZCreateNewOAuthSession } from "./createOAuthSession.schema"
import { createNewOAuthSession, CreateOAuthSession } from "./createOAuthSession.handler"
import { addIntegration, AddIntegration } from "./addIntegration.handler"
import { ZAddIntegration } from "./addIntegration.schema"
import { ZGetIntegration } from "./getIntegration.schema"
import { getIntegration, GetIntegration } from "./getIntegration.handler"
import { ZRemoveIntegration } from "./removeIntegration.schema"
import { removeIntegration, RemoveIntegration } from "./removeIntegration.handler"
import { ZUpdateIntegration } from "./updateIntegration.schema"
import { updateIntegration, UpdateIntegration } from "./updateIntegration.handler"
import { ConnectedEmailAccounts, connectedEmailAccounts } from "./connectedEmailAccounts.handler"
import { connectedSource, ConnectedSource } from "./connectedSources.handler"

export const integrationRouter = createTRPCRouter({
    createOAuthSession: protectedProcedure.input(ZCreateNewOAuthSession).mutation(async (opts: CreateOAuthSession) => {
        return createNewOAuthSession(opts)
    }),
    addIntegration: publicProcedure.input(ZAddIntegration).mutation(async (opts: AddIntegration) => {
        return addIntegration(opts)
    }),
    getIntegration: protectedProcedure.input(ZGetIntegration).query(async (opts: GetIntegration) => {
        return getIntegration(opts)
    }),
    connectedEmailAccounts: protectedProcedure.query(async (opts: ConnectedEmailAccounts) => {
        return connectedEmailAccounts(opts)
    }),
    connectedSource: protectedProcedure.query(async (opts: ConnectedSource) => {
        return connectedSource(opts)
    }),
    updateIntegration: protectedProcedure.input(ZUpdateIntegration).mutation(async (opts: UpdateIntegration) => {
        return updateIntegration(opts)
    }),
    removeIntegration: protectedProcedure.input(ZRemoveIntegration).mutation(async (opts: RemoveIntegration) => {
        return removeIntegration(opts)
    })
})