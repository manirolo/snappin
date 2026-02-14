import { createTRPCRouter, protectedProcedure } from "@snappin/api/_trpc"
import { vendorList, VendorList } from "./vendorList.handler"

export const vendorRouter = createTRPCRouter({
    list: protectedProcedure.query(async (opts: VendorList) => {
        return vendorList(opts)
    })
})