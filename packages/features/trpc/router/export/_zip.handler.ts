// export/_zip.handler.ts
import archiver from "archiver";
import { ContextProps } from "../../_trpc";
import { TExport } from "./export.schema";
import { buildInvoiceQuery } from "../invoice/utils/buildInvoiceQuery";
import { fetchAllWithQuery } from "../invoice/lib/fetchAllWithQuery";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import { assertResourceAccess } from "../../lib/assertResourceAccess";
import { invoiceBucket } from "@snappin/infra/google/storage";
import { randomUUID } from "crypto";
import { Readable } from "stream";

export type ZipExport = {
  ctx: ContextProps;
  input: TExport;
};

export async function zipExport({ ctx, input }: ZipExport) {
  await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId });

  // 1. Fetch invoices
  let invoices: InvoiceResource[];

  if (input.selectedIds?.length) {
    invoices = await ctx.db.invoice
      .find({
        _id: { $in: input.selectedIds },
        userId: ctx.userId,
        orgId: ctx.orgId,
      })
      .populate({ path: "extraction", select: "documentId fileName" })
      .lean();
  } else {
    const { query, extraMatch } = buildInvoiceQuery(ctx, input.filters);
    invoices = await fetchAllWithQuery<InvoiceResource>({
      model: ctx.db.invoice,
      query,
      extraMatch,
    });
  }

  const pdfs = invoices.filter((inv) => !!inv.extraction?.documentId);

  if (!pdfs.length) {
    throw new Error("No documents found to export");
  }

  // 2. Check existence and build stream list BEFORE the Promise
  const fileStreams: { stream: Readable; fileName: string }[] = [];

  for (const inv of pdfs) {
    const documentId = inv.extraction!.documentId;
    const rawFileName =
      inv.extraction?.fileName ??
      documentId.split("/").pop() ??
      `${inv.invoiceId ?? inv._id}`;

    const fileName = rawFileName.endsWith(".pdf")
      ? rawFileName
      : `${rawFileName}.pdf`;

    const gcpFile = invoiceBucket.file(documentId);
    const [exists] = await gcpFile.exists();
    if (!exists) continue;

    fileStreams.push({ stream: gcpFile.createReadStream(), fileName });
  }

  if (!fileStreams.length) {
    throw new Error("None of the documents exist in storage");
  }

  // 3. Stream: GCP PDFs → archiver → GCP temp ZIP
  const exportId = randomUUID();
  const zipPath = `temp/${ctx.userId}/exports/temp_${exportId}.zip`;
  const zipFile = invoiceBucket.file(zipPath);

  await new Promise<void>((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 1 } });
    const writeStream = zipFile.createWriteStream({
      metadata: { contentType: "application/zip" },
    });

    archive.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    archive.pipe(writeStream);

    for (const { stream, fileName } of fileStreams) {
      archive.append(stream, { name: fileName });
    }

    archive.finalize();
  });

  // 4. Generate signed URL (15 min expiry)
  const [signedUrl] = await zipFile.getSignedUrl({
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
    responseDisposition: `attachment; filename="invoices.zip"`,
  });

  return { downloadUrl: signedUrl };
}