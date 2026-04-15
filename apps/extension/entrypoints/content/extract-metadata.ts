import type { VendorConfig } from "@snappin/features/vendor/registry";
import type { InvoiceMetadata } from "../../lib/background/message-bus";

export function extractMetadata(
  el: Element,
  vendor: VendorConfig
): InvoiceMetadata {
  const m = vendor.metadata;
  return {
    vendorId: vendor.id,
    date:      m?.dateSelector      ? el.closest("tr, [class*='row'], li")?.querySelector(m.dateSelector)?.textContent?.trim()      : undefined,
    amount:    m?.amountSelector    ? el.closest("tr, [class*='row'], li")?.querySelector(m.amountSelector)?.textContent?.trim()    : undefined,
    invoiceId: m?.invoiceIdSelector ? el.closest("tr, [class*='row'], li")?.querySelector(m.invoiceIdSelector)?.textContent?.trim() : undefined,
    filename:  `${vendor.id}-invoice-${Date.now()}.pdf`,
  };
}