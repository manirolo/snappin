import type { VendorConfig } from "@snappin/features/vendor/registry";
import { findPdfLinkInHtml, runDomLinks } from "./strategies/dom-links";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("[content] script loaded, listening for vendor config...");

    // Forward PDFs caught by the page-world xhr-intercept script (postMessage from main world)
    window.addEventListener("message", (event) => {
      if (event.source !== window || event.data?.type !== "SNAPPIN_PDF") return;
      const { vendorId, blob, metadata } = event.data;
      if (vendorId && blob) {
        chrome.runtime.sendMessage({
          type: "PDF_FOUND",
          vendorId,
          blob,
          metadata: metadata ?? { vendorId, filename: `${vendorId}-invoice-${Date.now()}.pdf` },
        });
      }
    });

    chrome.runtime.onMessage.addListener(
      (msg: {
        type?: string;
        vendor?: VendorConfig;
        vendorId?: string;
        metadata?: { vendorId: string; filename?: string };
      }, _sender, sendResponse) => {
        if (msg?.type === "EXTRACT_PDF_FROM_THIS_PAGE" && msg.vendorId) {
          extractPdfFromCurrentPage(msg.vendorId, msg.metadata).then(sendResponse);
          return true;
        }

        if (msg?.type !== "VENDOR_CONFIG" || !msg.vendor) return;

        const vendor = msg.vendor;
        console.log("[content] vendor config received:", vendor.id, "strategy:", vendor.strategy);

        try {
          if (vendor.strategy === "xhr-intercept") {
            console.log("[content] xhr-intercept active — click View on a row to capture PDF");
            sendResponse?.({ ok: true });
          } else if (vendor.strategy === "dom-links") {
            console.log("[content] running dom-links — finding View/invoice links and fetching PDFs...");
            runDomLinks(vendor)
              .then(() => sendResponse?.({ ok: true }))
              .catch((err) => {
                console.error("[content] dom-links error:", err);
                sendResponse?.({ ok: false, error: String(err) });
              });
          } else {
            sendResponse?.({ ok: true });
          }
        } catch (err) {
          console.error("[content] error handling VENDOR_CONFIG:", err);
          sendResponse?.({ ok: false, error: String(err) });
        }

        return true; // keep channel open for async sendResponse
      }
    );
  },
});

/** Run on the Stripe invoice tab (same-origin): find PDF link in page, fetch it, send to background. */
async function extractPdfFromCurrentPage(
  vendorId: string,
  metadata?: { vendorId: string; filename?: string }
): Promise<void> {
  const baseUrl = window.location.href;
  const html = document.documentElement.outerHTML;
  const pdfUrl = findPdfLinkInHtml(html, baseUrl);
  if (pdfUrl) {
    try {
      const res = await fetch(pdfUrl, { credentials: "include" });
      if (res.headers.get("content-type")?.includes("application/pdf")) {
        const blob = await res.blob();
        chrome.runtime.sendMessage({
          type: "PDF_FOUND",
          vendorId,
          blob,
          metadata: metadata ?? { vendorId, filename: `${vendorId}-invoice-${Date.now()}.pdf` },
        });
        return;
      }
    } catch (err) {
      console.error("[content] failed to fetch PDF from invoice page:", err);
    }
  }
  console.warn("[content] no PDF link found on this invoice page");
  chrome.runtime.sendMessage({ type: "EXTRACT_PDF_FAILED", vendorId });
}