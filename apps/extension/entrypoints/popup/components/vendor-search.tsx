import { useState, useMemo } from "react";
import { vendors } from "@snappin/features/vendor/registry";
import type { VendorConfig } from "@snappin/features/vendor/registry";
import { VendorCard } from "./vendor-card";
import { Input } from "@snappin/ui/components/input";

type VendorStatus = "idle" | "extracting" | "done" | "error";

type Props = {
  onSelect: (vendor: VendorConfig) => void;
  statuses?: Record<string, VendorStatus>;
};

export function VendorSearch({ onSelect, statuses = {} }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        new URL(v.invoicePageUrl).hostname.includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search vendors..."
        className="h-9 text-sm"
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        {filtered.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onClick={onSelect}
              status={statuses[vendor.id] ?? "idle"}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
      <p className="text-sm text-muted-foreground">
        No vendors found for <span className="font-medium text-foreground">"{query}"</span>
      </p>
      <p className="text-xs text-muted-foreground">
        You can paste a billing portal URL directly instead
      </p>
    </div>
  );
}