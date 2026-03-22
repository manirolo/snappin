import type { VendorConfig } from "@snappin/features/vendor/registry";
import { extractMetadata } from "../extract-metadata";

export async function runDomLinks(vendor: VendorConfig) {
  console.log("[content:dom-links] scanning DOM for View/invoice links...");

  // Wait briefly for dynamic content (SPA); don't block too long — we'll still query links
  const listSelector = vendor.selectors?.invoiceList ?? "table tbody tr, [class*='invoice']";
  const listEl = await waitForElement(listSelector, 4000);
  if (!listEl) {
    console.warn("[content:dom-links] invoice list container not found, querying links anyway");
  }

  // Find all invoice download/view links (e.g. "View" that go to https://invoice.stripe.com/...)
  const selector = vendor.selectors?.downloadLink ?? "a[href*='invoice']";
  let links = Array.from(document.querySelectorAll<HTMLAnchorElement>(selector));

  // Fallback: if no links, look for any <a> with Stripe invoice URL (e.g. inside shadow DOM we can't query)
  if (links.length === 0 && (vendor.id === "railway" || selector.includes("stripe"))) {
    const allAnchors = document.querySelectorAll<HTMLAnchorElement>("a[href]");
    links = Array.from(allAnchors).filter(
      (a) =>
        a.href.includes("invoice.stripe.com") ||
        (a.href.includes("stripe") && a.href.includes("invoice"))
    );
    if (links.length > 0) {
      console.log("[content:dom-links] found links via fallback (all anchors):", links.length);
    }
  }

  // Dedupe by href so we don't process the same Stripe link twice
  const seen = new Set<string>();
  const uniqueLinks = links.filter((a) => {
    const h = a.href;
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });

  console.log(`[content:dom-links] found ${uniqueLinks.length} invoice/View links (selector: ${selector})`);

  if (uniqueLinks.length === 0) {
    console.warn("[content:dom-links] no View/invoice links found. Selector:", selector);
    chrome.runtime.sendMessage({
      type: "EXTRACTION_ERROR",
      vendorId: vendor.id,
      error: "No invoice links found on page",
    });
    return;
  }

  let extracted = 0;

  const pageOrigin = window.location.origin;
  for (const link of uniqueLinks) {
    const href = link.href;
    if (!href) continue;

    const linkOrigin = new URL(href).origin;
    if (linkOrigin !== pageOrigin) {
      // Cross-origin (e.g. Stripe from Railway): CORS blocks fetch with credentials. Open in tab and extract there.
      console.log("[content:dom-links] cross-origin invoice — opening in tab:", href);
      chrome.runtime.sendMessage({
        type: "EXTRACT_INVOICE_VIA_TAB",
        url: href,
        vendorId: vendor.id,
        metadata: extractMetadata(link, vendor),
      });
      extracted++; // count as "we handled it"; PDF will come back via the opened tab
      continue;
    }

    console.log("[content:dom-links] fetching:", href);

    try {
      const res = await fetch(href, { credentials: "include" });
      const contentType = res.headers.get("content-type") ?? "";

      let blob: Blob;

      if (contentType.includes("application/pdf")) {
        // Direct PDF response
        blob = await res.blob();
      } else if (contentType.includes("text/html")) {
        // Stripe/vendor invoice page — parse for PDF download link and fetch it
        const html = await res.text();
        const pdfUrl = findPdfLinkInHtml(html, href);
        if (pdfUrl) {
          console.log("[content:dom-links] found PDF link on invoice page, fetching:", pdfUrl);
          try {
            const pdfRes = await fetch(pdfUrl, { credentials: "include" });
            if (pdfRes.headers.get("content-type")?.includes("application/pdf")) {
              blob = await pdfRes.blob();
              const metadata = extractMetadata(link, vendor);
              console.log("[content:dom-links] sending PDF to background:", metadata);
              chrome.runtime.sendMessage({
                type: "PDF_FOUND",
                vendorId: vendor.id,
                blob,
                metadata,
              });
              extracted++;
            } else {
              console.warn("[content:dom-links] PDF link did not return PDF:", pdfUrl);
            }
          } catch (pdfErr) {
            console.error("[content:dom-links] failed to fetch PDF from invoice page:", pdfErr);
          }
        } else {
          console.log("[content:dom-links] no PDF link in HTML, sending page for print:", href);
          chrome.runtime.sendMessage({
            type: "PDF_FOUND",
            vendorId: vendor.id,
            blob: new Blob([html], { type: "text/html" }),
            metadata: {
              ...extractMetadata(link, vendor),
              invoicePageUrl: href,
            },
          });
          extracted++;
        }
        continue;
      } else {
        console.warn("[content:dom-links] unexpected content type:", contentType, href);
        continue;
      }

      const metadata = extractMetadata(link, vendor);
      console.log("[content:dom-links] sending PDF to background:", metadata);

      chrome.runtime.sendMessage({
        type: "PDF_FOUND",
        vendorId: vendor.id,
        blob,
        metadata,
      });

      extracted++;
    } catch (err) {
      console.error("[content:dom-links] failed to fetch:", href, err);
    }
  }

  console.log(`[content:dom-links] done — extracted ${extracted}/${uniqueLinks.length} invoices`);

  if (extracted > 0) {
    chrome.runtime.sendMessage({
      type: "EXTRACTION_DONE",
      vendorId: vendor.id,
      fileCount: extracted,
    });
  }
}

// Polls DOM until selector matches or timeout
function waitForElement(
  selector: string,
  timeout = 8000,
  interval = 300
): Promise<Element | null> {
  return new Promise((resolve) => {
    const start = Date.now();

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      if (Date.now() - start > timeout) {
        console.warn("[content] waitForElement timed out for:", selector);
        return resolve(null);
      }
      setTimeout(check, interval);
    };

    check();
  });
}

/** Parse invoice HTML (e.g. Stripe) for a direct PDF download link. Returns absolute URL or null. */
export function findPdfLinkInHtml(html: string, baseUrl: string): string | null {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const base = new URL(baseUrl);

    const resolve = (href: string) =>
      href.startsWith("http") ? href : new URL(href, base.origin).href;

    // Stripe invoice page: look for links that point to PDF (path often ends with /pdf or ?format=pdf)
    const candidates = doc.querySelectorAll<HTMLAnchorElement>(
      "a[href*='pdf'], a[href*='/pdf'], a[href*='.pdf'], a[download][href], a[href*='format=pdf']"
    );
    for (const a of candidates) {
      const href = a.getAttribute("href");
      if (!href) continue;
      const absolute = resolve(href);
      if (absolute.toLowerCase().includes("pdf") || a.hasAttribute("download")) return absolute;
    }

    // Stripe sometimes uses a link with download attribute or text "Download invoice"
    const links = doc.querySelectorAll<HTMLAnchorElement>("a[href]");
    for (const a of links) {
      const text = (a.textContent ?? "").toLowerCase();
      const aria = (a.getAttribute("aria-label") ?? "").toLowerCase();
      if (
        !text.includes("download") &&
        !text.includes("pdf") &&
        !aria.includes("download") &&
        !aria.includes("pdf")
      )
        continue;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;
      return resolve(href);
    }
  } catch (_) {
    // ignore parse errors
  }
  return null;
}