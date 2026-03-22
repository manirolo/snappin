import { createTRPCRouter, orgProcedure } from "@snappin/features/trpc/_trpc";
import { ConnectedMobileScanners, connectedMobileScanners } from "./connectedMobileScanners.handler";
import { AddMobileScanner, addMobileScanner } from "./addMobileScanner.handler";
import { ZAddMobileScanner } from "./addMobileScanner.schema";

export const mobileScannerRouter = createTRPCRouter({
    connectedMobileScanners: orgProcedure.query(async (opts: ConnectedMobileScanners) => connectedMobileScanners(opts)),
    addMobileScanner: orgProcedure.input(ZAddMobileScanner).mutation(async (opts: AddMobileScanner) => addMobileScanner(opts))
})