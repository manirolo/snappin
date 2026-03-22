import { createTRPCRouter, orgProcedure } from "@snappin/features/trpc/_trpc";
import { ZUpdateMonitoringIntegration } from "./updateMonitoring.schema";
import { updateMonitoringIntegration, UpdateMonitoringIntegration } from "./updateMonitoring.handler";
import { ZGetAccount } from "./getAccount.schema";
import { getAccount, GetAccount } from "./getAccount.handler";

export const emailAccountRouter = createTRPCRouter({
    getAccount: orgProcedure.input(ZGetAccount).query(async (opts: GetAccount) => getAccount(opts)),
    updateMonitoring: orgProcedure.input(ZUpdateMonitoringIntegration).mutation(async(opts: UpdateMonitoringIntegration) => updateMonitoringIntegration(opts))
})