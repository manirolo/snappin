import { ContextProps } from "@snappin/features/trpc/_trpc";
import { TGetInvoices } from "../getInvoice.schema";
import { buildInvoiceQuery } from "../utils/buildInvoiceQuery";
import { fetchAllWithQuery } from "./fetchAllWithQuery";

type TInvoiceFilters = TGetInvoices["filters"];

export async function fetchInvoicesForExport({
  ctx,
  filters,
  selectedIds,
}: {
  ctx: ContextProps;
  filters?: TInvoiceFilters;
  selectedIds?: string[];
}) {
  // Small explicit selection — just use $in on _id, skip query builder
  if (selectedIds?.length) {
    return ctx.db.invoice
      .find({ _id: { $in: selectedIds }, userId: ctx.userId, orgId: ctx.orgId })
      .select("invoiceId invoiceDate description currency totals vendorId recipient")
      .populate("vendor")
      .lean();
  }

  // Large/all export — reuse the same query builder as getAllInvoices
  const { query, extraMatch } = buildInvoiceQuery(ctx, filters);

  return fetchAllWithQuery({ model: ctx.db.invoice, query, extraMatch });
}