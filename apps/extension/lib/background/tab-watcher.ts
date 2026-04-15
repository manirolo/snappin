import { getVendorById } from "@snappin/features/vendor/registry";
import { sendMessage } from "./message-bus";

// tabId → vendorId
const watchedTabs = new Map<number, { vendorId: string; token: string }>();

export function watchTab(tabId: number, vendorId: string, token: string) {
    watchedTabs.set(tabId, { vendorId, token });
}
export function getWatchedTab(tabId: number) {
    return watchedTabs.get(tabId) ?? null;
}

export function initTabWatcher() {
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
        console.log("[tab-watcher] tab updated:", tabId, changeInfo.status);
        if (changeInfo.status !== "complete") return;

        const entry = watchedTabs.get(tabId);
        console.log("[tab-watcher] entry for tab:", entry);
        if (!entry) return;

        const vendor = getVendorById(entry.vendorId);
        console.log("[tab-watcher] vendor config:", vendor);
        if (!vendor) return;

        const sendConfig = async () => {
            try {
                await chrome.tabs.sendMessage(tabId, { type: "VENDOR_CONFIG", vendor });
                console.log("[tab-watcher] vendor config sent — content script will run strategy");
                console.log("[tab-watcher] Tip: content script logs appear in the PAGE console (F12 on the Railway tab), not here.");
                // For xhr-intercept we're done; for dom-links keep the entry so PDF_FOUND from opened tabs can use the token.
                if (vendor.strategy === "xhr-intercept") watchedTabs.delete(tabId);
            } catch (e) {
                throw e;
            }
        };

        try {
            if (vendor.strategy === "xhr-intercept") {
                console.log("[tab-watcher] injecting xhr-intercept into page world");
                await chrome.scripting.executeScript({
                    target: { tabId },
                    func: patchFetchAndXhrInPageWorld,
                    args: [{ id: vendor.id }],
                    world: "MAIN",
                });
            }

            console.log("[tab-watcher] sending vendor config to content script:", tabId);
            // Delay so the content script has time to load and attach its listener (SPA pages can fire "complete" early).
            await new Promise((r) => setTimeout(r, 350));
            await sendConfig();
        } catch (err) {
            console.error(`[tab-watcher] failed to send vendor config:`, err);
            // Retry a few times — content script may load after "complete".
            const retries = [400, 800];
            for (const delay of retries) {
                await new Promise((r) => setTimeout(r, delay));
                try {
                    await sendConfig();
                    return;
                } catch (retryErr) {
                    console.error(`[tab-watcher] retry after ${delay}ms failed:`, retryErr);
                }
            }
            sendMessage({ type: "EXTRACTION_ERROR", vendorId: entry.vendorId, error: String(err) });
        }
    });
    chrome.tabs.onRemoved.addListener((tabId) => {
        watchedTabs.delete(tabId);
    });
}

export function getTokenByVendorId(vendorId: string): string | null {
    for (const [, entry] of watchedTabs) {
        if (entry.vendorId === vendorId) return entry.token;
    }
    return null;
}

/** Remove watched entry for a vendor (call after EXTRACTION_DONE / EXTRACTION_ERROR). */
export function removeWatchedTabByVendorId(vendorId: string) {
    for (const [id, entry] of watchedTabs) {
        if (entry.vendorId === vendorId) {
            watchedTabs.delete(id);
            return;
        }
    }
}

/** Injected into the page (world: MAIN) so we intercept the page's fetch/XHR when user clicks "view". */
function patchFetchAndXhrInPageWorld(vendor: { id: string }) {
    const vendorId = vendor.id;

    const originalFetch = window.fetch.bind(window);
    window.fetch = async function (...args: Parameters<typeof fetch>) {
        const res = await originalFetch(...args);
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("application/pdf")) {
            try {
                const clone = res.clone();
                const blob = await clone.blob();
                window.postMessage(
                    {
                        type: "SNAPPIN_PDF",
                        vendorId,
                        blob,
                        metadata: { vendorId, filename: `${vendorId}-invoice-${Date.now()}.pdf` },
                    },
                    "*"
                );
            } catch (_) {}
        }
        return res;
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async?: boolean) {
        (this as unknown as { _url: string })._url = url.toString();
        return origOpen.call(this, method, url, async ?? true);
    };
    XMLHttpRequest.prototype.send = function (...args: unknown[]) {
        this.addEventListener("load", function () {
            if (this.responseType === "blob" || this.getResponseHeader("content-type")?.includes("application/pdf")) {
                const blob =
                    this.response instanceof Blob
                        ? this.response
                        : new Blob([this.response as BlobPart], { type: "application/pdf" });
                window.postMessage(
                    {
                        type: "SNAPPIN_PDF",
                        vendorId,
                        blob,
                        metadata: { vendorId, filename: `${vendorId}-invoice-${Date.now()}.pdf` },
                    },
                    "*"
                );
            }
        });
        return origSend.apply(this, args);
    };
}
