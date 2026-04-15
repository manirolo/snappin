import { createTRPCRouter, orgProcedure } from "@snappin/features/trpc/_trpc";
import { ConnectedMobileScanners, connectedMobileScanners } from "./connectedMobileScanners.handler";
import { AddMobileScanner, addMobileScanner } from "./addMobileScanner.handler";
import { ZAddMobileScanner } from "./addMobileScanner.schema";
import { ZRemoveMobileScanner } from "./removeMobileScanner.schema";
import { removeMobileScanner, RemoveMobileScanner } from "./removeMobileScanner.handler";

export const mobileScannerRouter = createTRPCRouter({
    connectedMobileScanners: orgProcedure.query(async (opts: ConnectedMobileScanners) => connectedMobileScanners(opts)),
    addMobileScanner: orgProcedure.input(ZAddMobileScanner).mutation(async (opts: AddMobileScanner) => addMobileScanner(opts)),
    removeMobileScanner: orgProcedure.input(ZRemoveMobileScanner).mutation(async (opts: RemoveMobileScanner) => removeMobileScanner(opts))
})