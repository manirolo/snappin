// csvExport.ts
import { stringify } from "csv-stringify/sync";
import { ContextProps } from "../../_trpc";
import { TExport } from "./export.schema";
import { buildInvoiceQuery } from "../invoice/utils/buildInvoiceQuery";
import { fetchAllWithQuery } from "../invoice/lib/fetchAllWithQuery";
import { formatInvoiceForCSV } from "./utils/formatInvoiceForCSV";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import { assertResourceAccess } from "../../lib/assertResourceAccess";

export type CSVExport = {
    ctx: ContextProps;
    input: TExport;
};

export async function csvExport({ ctx, input }: CSVExport) {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId });

    let invoices: InvoiceResource[];

    if (input.selectedIds?.length) {
        // Small explicit selection — skip query builder
        invoices = await ctx.db.invoice
            .find({
                _id: { $in: input.selectedIds },
                userId: ctx.userId,
                orgId: ctx.orgId,
            })
            .populate("vendor")
            .lean();
    } else {
        // Export All or filtered — reuse query builder
        const { query, extraMatch } = buildInvoiceQuery(ctx, input.filters);
        invoices = await fetchAllWithQuery<InvoiceResource>({
            model: ctx.db.invoice,
            query,
            extraMatch,
        });
    }

    const rows = invoices.map(formatInvoiceForCSV);

    const csv = stringify(rows, { header: true });

    return {
        data: Buffer.from(csv).toString("base64"),
        filename: "invoices.csv",
        mimeType: "text/csv",
    };
}