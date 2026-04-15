import { ContextProps } from "@snappin/features/trpc/_trpc";
import { TUpdateInvoice } from "./update.schema";
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess";

export type UpdateInvoice = {
  ctx: ContextProps;
  input: TUpdateInvoice;
};

export async function updateInvoice({ ctx, input }: UpdateInvoice) {
  await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
  const { invoiceId, data } = input;

  const updated = await ctx.db.invoice.findOneAndUpdate(
    { _id: invoiceId },
    [{
      $replaceWith: {
        $mergeObjects: [
          "$$ROOT",
          data,
        ]
      }
    }],
    { returnDocument: "after", updatePipeline: true },
  );

  if (!updated) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
  }

  return updated;
}