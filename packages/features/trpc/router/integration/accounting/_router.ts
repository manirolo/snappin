import { createTRPCRouter, orgProcedure, publicProcedure } from "@snappin/features/trpc/_trpc";
import { ZAddAccounting } from "./addAccounting.schema";
import { AddAccounting, addAccounting } from "./addAccounting.handler";
import { ZDisconnectAccounting } from "./disconnectAccounting.schema";
import { disconnectAccounting, DisconnectAccounting } from "./disconnectAccounting.handler";

export const accountingRouter = createTRPCRouter({
    addAccounting: publicProcedure.input(ZAddAccounting).mutation(async (opts: AddAccounting) => addAccounting(opts)),
    disconnectAccounting: orgProcedure.input(ZDisconnectAccounting).mutation(async (opts: DisconnectAccounting) => disconnectAccounting(opts))
})