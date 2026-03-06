import { createTRPCRouter, protectedProcedure } from "@snappin/features/trpc/_trpc"
import { vendorList, VendorList } from "./vendorList.handler"

export const vendorRouter = createTRPCRouter({
    list: protectedProcedure.query(async (opts: VendorList) => {
        return vendorList(opts)
    })
})