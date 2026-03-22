import { useState, useCallback } from "react";
import type { VendorConfig } from "@snappin/features/vendor/registry/types";
import { VendorSearch } from "../components/vendor-search";
import { useClerk } from "@clerk/chrome-extension";

type VendorStatus = "idle" | "extracting" | "done" | "error";

export function VendorsPage() {
  const { session } = useClerk();
  const [statuses, setStatuses] = useState<Record<string, VendorStatus>>({});

  // ← add this helper
  const setStatus = useCallback((id: string, status: VendorStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  async function handleVendorSelect(vendor: VendorConfig) {
  const token = await session?.getToken();
  console.log("[vendors] token:", token ? "✓ got token" : "✗ no token");  // ← add
  if (!token) return;

  setStatus(vendor.id, "extracting");

  const tab = await chrome.tabs.create({ url: vendor.invoicePageUrl });
  console.log("[vendors] tab created:", tab.id);  // ← add

  await chrome.runtime.sendMessage({
    type: "WATCH_TAB",
    tabId: tab.id,
    vendorId: vendor.id,
    token,
  });
  console.log("[vendors] WATCH_TAB sent");  // ← add
}

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Extract invoices
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select a vendor to open their billing page and extract invoices
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <VendorSearch onSelect={handleVendorSelect} statuses={statuses} />
      </div>
    </div>
  );
}