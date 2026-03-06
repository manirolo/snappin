import { ContextProps } from "@snappin/features/trpc/_trpc";
import { TUpdateInvoice } from "./update.schema";
import { TRPCError } from "@trpc/server"

export type UpdateInvoice = {
  ctx: ContextProps;
  input: TUpdateInvoice;
};

export async function updateInvoice({ ctx, input }: UpdateInvoice) {
  const { invoiceId, data } = input;

  const updated = await ctx.db.invoice.findOneAndUpdate(
    { _id: invoiceId },
    [{
      $replaceWith: {
        $mergeObjects: [
          "$$ROOT",
          data,
          {
            invoice: {
              $mergeObjects: ["$$ROOT.invoice", data.invoice]
            }
          }
        ]
      }
    }],
    { returnDocument: "after", new: true, updatePipeline: true },
  );

  if (!updated) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
  }

  return updated;
}