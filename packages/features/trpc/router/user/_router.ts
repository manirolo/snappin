import { createTRPCRouter, protectedProcedure, } from "@snappin/features/trpc/_trpc";
import { ZDeleteUser } from "./deleteUser.schema";
import { deleteUser, DeleteUser } from "./deleteUser.handler";

export const userRouter = createTRPCRouter({
    deleteUser: protectedProcedure.input(ZDeleteUser).mutation(async (opts: DeleteUser) => deleteUser(opts))
})