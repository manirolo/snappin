import { createTRPCRouter, orgProcedure } from "@snappin/features/trpc/_trpc"
import { vendorList, VendorList } from "./vendorList.handler"

export const vendorRouter = createTRPCRouter({
    list: orgProcedure.query(async (opts: VendorList) => {
        return vendorList(opts)
    })
})