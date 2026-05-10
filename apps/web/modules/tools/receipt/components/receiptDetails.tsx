// components/ReceiptDetails.tsx
"use client";
import type { RouterOutputs } from "@snappin/features/trpc/_root";

type ReceiptData = RouterOutputs["tool"]["receipt"]["convertToExcel"]["data"];

const fmt = (amount: number | null, currency: string | null) => {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
  }).format(amount);
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm/6 font-medium text-foreground">{value ?? "—"}</span>
  </div>
);

export const ReceiptDetails = ({
  data,
  onDownload,
}: {
  data: ReceiptData;
  onDownload?: () => void;
}) => {
  if (!data) return;

  const invoice = data;
  const vendor = data.vendor;
  const currency = invoice?.totals?.currency ?? null;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border bg-background p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Receipt Details</h2>
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium text-blue-600 hover:bg-muted/50 transition-colors"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Download as Excel
          </button>
        )}
      </div>

      {/* Key fields */}
      <div className="grid grid-cols-2 gap-6">
        <Row label="Date" value={invoice?.invoiceDate} />
        <Row
          label="Total Amount"
          value={fmt(invoice?.totals?.total ?? null, currency)}
        />
        <Row label="Merchant" value={vendor?.name} />{" "}
        {/* vendor comes from data.vendor */}
        <Row label="Receipt Number" value={invoice?.invoiceId} />
      </div>

      {/* Line items */}
      {!!invoice?.lineItems?.length && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Items</h3>
          <div className="rounded-xl bg-bg-2 divide-y overflow-hidden">
            {invoice.lineItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between px-4 py-5 gap-4"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-fg-3">
                    {item.description ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Qty: {item.quantity ?? 1}
                  </span>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {fmt(item.total ?? null, currency)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals footer */}
          <div className="flex flex-col gap-2 items-end text-sm">
            {invoice?.totals?.subtotal != null && (
              <div className="flex gap-8 text-muted-foreground">
                <span>Subtotal</span>
                <span>{fmt(invoice?.totals.subtotal, currency)}</span>
              </div>
            )}
            {invoice?.totals?.discount != null && (
              <div className="flex gap-8 text-muted-foreground">
                <span>Discount</span>
                <span>{fmt(invoice?.totals.discount, currency)}</span>
              </div>
            )}
            {invoice?.totals?.tax?.amount != null && (
              <div className="flex gap-8 text-muted-foreground">
                <span>Tax</span>
                <span>{fmt(invoice?.totals.tax.amount, currency)}</span>
              </div>
            )}
            <div className="flex gap-8 font-semibold border-t pt-3 mt-1">
              <span>Total</span>
              <span>{fmt(invoice?.totals?.total ?? null, currency)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
