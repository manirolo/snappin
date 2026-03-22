export type ExtensionMessage =
  | { type: "WATCH_TAB";        tabId: number; vendorId: string; token: string }
  | { type: "EXTRACTION_DONE";  vendorId: string; fileCount: number }
  | { type: "EXTRACTION_ERROR"; vendorId: string; error: string }
  | { type: "PDF_FOUND";        vendorId: string; blob: Blob; metadata: InvoiceMetadata }
  | { type: "UPLOAD_PROGRESS";  vendorId: string; uploaded: number; total: number }
  | { type: "EXTRACT_INVOICE_VIA_TAB"; url: string; vendorId: string; metadata?: InvoiceMetadata }
  | { type: "EXTRACT_PDF_FAILED"; vendorId: string };

export type InvoiceMetadata = {
  vendorId: string;
  invoiceId?: string;
  date?: string;
  amount?: string;
  filename?: string;
};

// Type-safe wrapper around chrome.runtime.sendMessage
export function sendMessage(msg: ExtensionMessage) {
  chrome.runtime.sendMessage(msg).catch(() => {
    // Popup may be closed — swallow the error
  });
}

// Type-safe listener
export function onMessage(
  handler: (msg: ExtensionMessage, sender: chrome.runtime.MessageSender) => void
) {
  chrome.runtime.onMessage.addListener((msg, sender) => {
    handler(msg as ExtensionMessage, sender);
  });
}