import { getTokenByVendorId, initTabWatcher, removeWatchedTabByVendorId, watchTab } from "../lib/background/tab-watcher";
import { onMessage } from "../lib/background/message-bus";
import { enqueue } from "../lib/background/upload-queue";

// Tabs we opened for invoice extraction — we close them after receiving the PDF
const extractionTabIds = new Set<number>();

export default defineBackground(() => {
  initTabWatcher();

  onMessage((msg, sender) => {
    console.log("[background] received message:", msg.type);
    switch (msg.type) {
      case "WATCH_TAB": {
        watchTab(msg.tabId, msg.vendorId, msg.token);
        break;
      }

      case "PDF_FOUND": {
        const token = getTokenByVendorId(msg.vendorId);
        if (!token) {
          console.error(`[background] No token found for vendor ${msg.vendorId}`);
          break;
        }
        enqueue(msg.blob, msg.metadata, token);
        if (sender.tab?.id && extractionTabIds.has(sender.tab.id)) {
          extractionTabIds.delete(sender.tab.id);
          chrome.tabs.remove(sender.tab.id).catch(() => {});
        }
        break;
      }

      case "EXTRACT_PDF_FAILED": {
        if (sender.tab?.id && extractionTabIds.has(sender.tab.id)) {
          extractionTabIds.delete(sender.tab.id);
          chrome.tabs.remove(sender.tab.id).catch(() => {});
        }
        break;
      }

      case "EXTRACTION_DONE":
      case "EXTRACTION_ERROR": {
        // Delay removal so PDF_FOUND from "open in tab" extractions can still use the token
        setTimeout(() => removeWatchedTabByVendorId(msg.vendorId), 30_000);
        break;
      }

      case "EXTRACT_INVOICE_VIA_TAB": {
        const { url, vendorId, metadata } = msg;
        chrome.tabs.create({ url, active: false }, (tab) => {
          if (!tab?.id) return;
          extractionTabIds.add(tab.id);
          const listener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
            if (tabId !== tab.id || changeInfo.status !== "complete") return;
            chrome.tabs.onUpdated.removeListener(listener);
            // Give content script in the new tab time to attach its listener
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id!, {
                type: "EXTRACT_PDF_FROM_THIS_PAGE",
                vendorId,
                metadata: metadata ?? { vendorId, filename: `${vendorId}-invoice-${Date.now()}.pdf` },
                }).catch((err) => {
                console.error("[background] EXTRACT_PDF_FROM_THIS_PAGE failed:", err);
                extractionTabIds.delete(tab.id);
                chrome.tabs.remove(tab.id).catch(() => {});
              });
            }, 600);
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
        break;
      }
    }
  });

  console.log("[snappin] Background service worker ready");
});