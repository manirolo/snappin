import { ContextProps } from "../../../_trpc";
import { TGetInvoices } from "../getInvoice.schema";

type TInvoiceFilters = TGetInvoices["filters"];

export function buildInvoiceQuery(
  ctx: ContextProps,
  filters?: TInvoiceFilters
) {
  const query: Record<string, unknown> = {
    userId: ctx.userId,
    orgId: ctx.orgId,
  };

  if (filters?.vendorIds?.length)
    query["vendorId"] = { $in: filters.vendorIds };

  if (filters?.currencies?.length)
    query["totals.currency"] = { $in: filters.currencies };

  if (filters?.invoiceRecipients?.length)
    query["recipient.name"] = {
      $in: filters.invoiceRecipients.map(
        (e) => new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      ),
    };

  const extraMatch: Record<string, unknown> = {};

  if (filters?.senderEmails?.length)
    extraMatch["extraction.source.metadata.from"] = {
      $in: filters.senderEmails.map(
        (e) => new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      ),
    };

  if (filters?.recipientEmails?.length)
    extraMatch["extraction.source.metadata.to"] = {
      $in: filters.recipientEmails.map(
        (e) => new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      ),
    };

  return {
    query,
    extraMatch: Object.keys(extraMatch).length ? extraMatch : undefined,
  };
}