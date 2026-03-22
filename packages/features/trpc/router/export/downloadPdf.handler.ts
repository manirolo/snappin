// downloadPdf.handler.ts
import { ContextProps } from "../../_trpc";
import { TDownloadPdf } from "./downloadPdf.schema";
import { assertResourceAccess } from "../../lib/assertResourceAccess";
import { storageService } from "@snappin/infra/google/storage";
import { TRPCError } from "@trpc/server";

export type DownloadPdf = {
    ctx: ContextProps;
    input: TDownloadPdf;
};

// downloadPdf.handler.ts — return buffer as base64 instead of signed URL
export async function downloadPdf({ ctx, input }: DownloadPdf) {
  await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId });

  const invoice = await ctx.db.invoice
    .findOne({ _id: input.invoiceId, userId: ctx.userId, orgId: ctx.orgId })
    .populate({ path: "extraction", select: "documentId fileName" })
    .lean();

  if (!invoice) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });

  const documentId = invoice.extraction?.documentId;
  if (!documentId) throw new TRPCError({ code: "NOT_FOUND", message: "No document found" });

  const rawFileName = invoice.extraction?.fileName ?? invoice.invoiceId ?? invoice._id;
  const fileName = String(rawFileName).endsWith(".pdf")
    ? String(rawFileName)
    : `${rawFileName}.pdf`;

  // ✅ Download buffer server-side, send as base64 — no CORS issue
  const buffer = await storageService.download(documentId);

  return {
    data: buffer.toString("base64"),
    fileName,
    mimeType: "application/pdf",
  };
}