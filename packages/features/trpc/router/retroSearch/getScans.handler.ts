import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TGetScans } from "./getScans.schema";

export type GetScans = {
    ctx: ContextProps;
};

export async function getScans({ ctx }: GetScans): Promise<TGetScans[]> {
    return ctx.db.scan.find({ userId: ctx.userId, orgId: ctx.orgId }).populate("integration", "identifierEmail").sort({ createdAt: -1 })
}