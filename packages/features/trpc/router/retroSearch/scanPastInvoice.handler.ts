import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TScanPastInvoices } from "./scanPastInvoice.schema"
import { inboxScan } from "@snappin/features/inbox/trigger/inbox/scan.task"
import { TRPCError } from "@trpc/server"
import { AppRole } from "@snappin/shared/apps/app.schema"
import { ScanStatus } from "@snappin/shared/inbox/scan.schema"

export async function scanPastInvoices({ ctx, input }: { ctx: ContextProps; input: TScanPastInvoices }) {
  const integration = await ctx.db.integration.findOne({
    userId: ctx.userId,
    orgId: ctx.orgId,
    identifierEmail: input.email,
    appRole: AppRole.EMAIL_SOURCE,
  })

  if (!integration) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" })

  const scanRequest = await ctx.db.scan.create({
    userId: ctx.userId,
    orgId: ctx.orgId,
    integrationId: integration?._id?.toString(),
    startDate: input.from,
    endDate: input.to,
    status: ScanStatus.QUEUED
  })

  if(!scanRequest) return

  const scanTask = await inboxScan.trigger({ scanId: scanRequest?._id?.toString() ?? "" })

  await ctx.db.scan.findOneAndUpdate({ _id: scanRequest?._id?.toString() }, { scanId: scanTask.id })
  
}