import { createTRPCRouter } from "../../../trpc/_trpc"
import { receiptRouter } from "./receipt/_router"

export const toolRouter = createTRPCRouter({
    receipt: receiptRouter,
})