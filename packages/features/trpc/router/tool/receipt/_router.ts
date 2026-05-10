import { createTRPCRouter, protectedProcedure } from "../../../../trpc/_trpc"
import { ConvertToExcel, convertToExcel } from "./convertToExcel.handler"
import { ZConvertToExcel } from "./convertToExcel.schema"


export const receiptRouter = createTRPCRouter({
    convertToExcel: protectedProcedure.input(ZConvertToExcel).mutation(async (opts: ConvertToExcel) => {
        return convertToExcel(opts)
    }),
})