import { createTRPCRouter, orgProcedure, publicProcedure } from "../../_trpc"
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
import { connectedSource, ConnectedSource } from "./connectedSources.handler"
import { ZConnectedSource } from "./connectedSource.schema"
import { connectedMobileScanners, ConnectedMobileScanners } from "./mobileScanners/connectedMobileScanners.handler"
import { mobileScannerRouter } from "./mobileScanners/_router"
import { accountingRouter } from "./accounting/_router"
import { storageRouter } from "./storage/_router"

export const integrationRouter = createTRPCRouter({
    createOAuthSession: orgProcedure.input(ZCreateNewOAuthSession).mutation(async (opts: CreateOAuthSession) => {
        return createNewOAuthSession(opts)
    }),
    addIntegration: publicProcedure.input(ZAddIntegration).mutation(async (opts: AddIntegration) => {
        return addIntegration(opts)
    }),
    getIntegration: orgProcedure.input(ZGetIntegration).query(async (opts: GetIntegration) => {
        return getIntegration(opts)
    }),
    connectedMobileScanners: orgProcedure.input(ZGetIntegration).query(async (opts: ConnectedMobileScanners) => {
        return connectedMobileScanners(opts)
    }),
    connectedSource: orgProcedure.input(ZConnectedSource).query(async (opts: ConnectedSource) => {
        return connectedSource(opts)
    }),
    updateIntegration: orgProcedure.input(ZUpdateIntegration).mutation(async (opts: UpdateIntegration) => {
        return updateIntegration(opts)
    }),
    removeIntegration: orgProcedure.input(ZRemoveIntegration).mutation(async (opts: RemoveIntegration) => {
        return removeIntegration(opts)
    }),

    accounting: accountingRouter,

    mobileScanners: mobileScannerRouter,

    storage: storageRouter
})