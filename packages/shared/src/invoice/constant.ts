import { InvoiceType } from "./invoice.schema"

export const INVOICE_TYPE_OPTIONS: { value: InvoiceType; label: string }[] = [
  { value: "invoice", label: "Invoice" },
  { value: "receipt", label: "Receipt" },
] satisfies { value: InvoiceType; label: string }[]