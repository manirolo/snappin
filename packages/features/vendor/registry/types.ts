export type ExtractionStrategy =
  | "dom-links"       // static <a href="*.pdf"> links in DOM
  | "xhr-intercept"   // PDF returned via XHR/fetch (dynamic)
  | "print-to-pdf"    // fallback: render page → PDF

export type VendorConfig = {
  id: string;
  name: string;
  logo?: string;                  // URL or local asset path

  // Which URLs should activate this vendor's content script
  matchUrls: string[];

  // Where to navigate the user to find their invoices
  invoicePageUrl: string;

  strategy: ExtractionStrategy;

  selectors?: {
    invoiceList?: string;         // rows/cards wrapping each invoice
    downloadLink?: string;        // the actual <a> to click/fetch
    invoiceIdLink?: string;       // link that leads to invoice detail page
  };

  // Optional: pull structured metadata from the page alongside the PDF
  metadata?: {
    dateSelector?: string;
    amountSelector?: string;
    invoiceIdSelector?: string;
    vendorNameOverride?: string;  // e.g. "Amazon Web Services" vs "Amazon"
  };

  // For xhr-intercept: URL patterns to watch for PDF responses
  interceptPatterns?: string[];
};