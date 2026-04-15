// utils/formatInvoiceForCSV.ts
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";

function toDecimal(value?: number | null): string {
  if (value == null) return "";
  return (value / 100).toFixed(2);
}

function formatDate(value?: string | number | null): string {
  if (value == null) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "Invalid date"; // YYYY-MM-DD
}

function getDriveUrl(integrations: InvoiceResource["integrations"]): string {
  if (!integrations?.length) return "";

  const driveIntegration = integrations.find(
    (i) => i.appSlug === AppSlug.GOOGLE_DRIVE 
  );

  return driveIntegration?.url ?? "";
}

export function formatInvoiceForCSV(invoice: InvoiceResource) {
  return {
    "Invoice Date": formatDate(invoice.invoiceDate),
    "Invoice ID": invoice.invoiceId ?? "",
    "Due Date": formatDate(invoice.dueDate),

    "Merchant": invoice.vendor?.name ?? "",
    "Merchant Tax ID": invoice.vendor?.taxId ?? "",

    "Recipient Name": invoice.recipient?.name ?? "",
    "Recipient Tax ID": invoice.recipient?.taxId ?? "",

    "Subtotal": toDecimal(invoice.totals?.subtotal),
    "Tax Amount": toDecimal(invoice.totals?.tax?.amount),
    "Total": toDecimal(invoice.totals?.total),
    "Currency": invoice.totals?.currency ?? "",

    "Document Type": invoice.metadata?.documentType ?? "",

    "attachment": getDriveUrl(invoice.integrations)
  };
}