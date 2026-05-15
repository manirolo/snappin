import { createTRPCRouter, orgProcedure, publicProcedure } from "@snappin/features/trpc/_trpc";
// import { ZUpdateMonitoringIntegration } from "./updateMonitoring.schema";
// import { updateMonitoringIntegration, UpdateMonitoringIntegration } from "./updateMonitoring.handler";
import { ZGetAccount } from "./getAccount.schema";
import { getAccount, GetAccount } from "./getAccount.handler";
import { ZAddAccount } from "./addAccount.schema";
import { addAccount, AddAccount } from "./addAccount.handler";
import { ZDisconnectAccount } from "./disconnectAccount.schema";
import { disconnectAccount, DisconnectAccount } from "./disconnectAccount.handler";

export const emailAccountRouter = createTRPCRouter({
    addAccount: publicProcedure.input(ZAddAccount).mutation(async (opts: AddAccount) => addAccount(opts)),
    disconnectAccount: orgProcedure.input(ZDisconnectAccount).mutation(async (opts: DisconnectAccount) => disconnectAccount(opts)),
    getAccount: orgProcedure.input(ZGetAccount).query(async (opts: GetAccount) => getAccount(opts)),
    // updateMonitoring: orgProcedure.input(ZUpdateMonitoringIntegration).mutation(async (opts: UpdateMonitoringIntegration) => updateMonitoringIntegration(opts)),
})