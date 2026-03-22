import type { VendorConfig } from "@snappin/features/vendor/registry";

type Props = {
  vendor: VendorConfig;
  onClick: (vendor: VendorConfig) => void;
  status?: "idle" | "extracting" | "done" | "error";
};

export function VendorCard({ vendor, onClick, status = "idle" }: Props) {
  return (
    <button
      onClick={() => onClick(vendor)}
      disabled={status === "extracting"}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        bg-background hover:bg-muted border border-border
        transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Logo / fallback initial */}
      <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border">
        {vendor.logo ? (
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="size-5 object-contain"
          />
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            {vendor.name[0].toUpperCase()}
          </span>
        )}
      </div>

      {/* Name + URL hint */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {vendor.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {new URL(vendor.invoicePageUrl).hostname}
        </p>
      </div>

      {/* Status badge */}
      <StatusBadge status={status} />
    </button>
  );
}

type ActiveStatus = "extracting" | "done" | "error";

function StatusBadge({ status }: { status: Props["status"] }) {
  if (!status || status === "idle") return null;

  const map: Record<ActiveStatus, { label: string; className: string }> = {
    extracting: { label: "Extracting...", className: "text-blue-500" },
    done:       { label: "Done",          className: "text-green-500" },
    error:      { label: "Failed",        className: "text-red-500" },
  };

  const { label, className } = map[status as ActiveStatus];
  return (
    <span className={`text-xs font-medium shrink-0 ${className}`}>
      {label}
    </span>
  );
}