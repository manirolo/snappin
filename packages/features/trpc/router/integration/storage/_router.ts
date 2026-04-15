import { createTRPCRouter, orgProcedure, publicProcedure } from "@snappin/features/trpc/_trpc";
import { ZAddStorage } from "./addStorage.schema";
import { addStorage, AddStorage } from "./addStorage.handler";
import { ZDisconnectStorage } from "./disconnectStorage.schema";
import { disconnectStorage, DisconnectStorage } from "./disconnectStorage.handler";

export const storageRouter = createTRPCRouter({
    addStorage: publicProcedure.input(ZAddStorage).mutation(async (opts: AddStorage) => addStorage(opts)),
    disconnectStorage: orgProcedure.input(ZDisconnectStorage).mutation(async (opts: DisconnectStorage) => disconnectStorage(opts))
})