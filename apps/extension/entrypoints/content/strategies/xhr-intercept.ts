import type { VendorConfig } from "@snappin/features/vendor/registry";
import { extractMetadata } from "../extract-metadata";

export function runXhrIntercept(vendor: VendorConfig) {
    console.log("[content:xhr-intercept] patching fetch + XHR");

    // Patch fetch
    const originalFetch = window.fetch.bind(window);
    window.fetch = async function (...args) {
        const res = await originalFetch(...args);

        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/pdf")) {
            console.log("[content:xhr-intercept] caught PDF via fetch:", args[0]);

            // Clone before consuming — response body can only be read once
            const clone = res.clone();
            const blob = await clone.blob();

            chrome.runtime.sendMessage({
                type: "PDF_FOUND",
                vendorId: vendor.id,
                blob,
                metadata: {
                    vendorId: vendor.id,
                    filename: `${vendor.id}-invoice-${Date.now()}.pdf`,
                },
            });
        }

        return res;
    };

    // Patch XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
        method: string,
        url: string | URL,
        async: boolean = true,
        username?: string | null,
        password?: string | null
    ) {
        (this as unknown as { _url: string })._url = url.toString();
        return originalOpen.call(this, method, url, async, username, password);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener("load", function () {
            if (this.responseType === "blob" || this.getResponseHeader("content-type")?.includes("application/pdf")) {
                console.log("[content:xhr-intercept] caught PDF via XHR:", (this as unknown as { _url: string })._url);

                const blob = this.response instanceof Blob
                    ? this.response
                    : new Blob([this.response], { type: "application/pdf" });

                chrome.runtime.sendMessage({
                    type: "PDF_FOUND",
                    vendorId: vendor.id,
                    blob,
                    metadata: {
                        vendorId: vendor.id,
                        filename: `${vendor.id}-invoice-${Date.now()}.pdf`,
                    },
                });
            }
        });

        return originalSend.call(this, ...args);
    };
}