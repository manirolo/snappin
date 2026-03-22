import React, { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@snappin/ui/lib/utils";
import { HiOutlineFilter } from "react-icons/hi";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePaperAirplane,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
} from "react-icons/hi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@snappin/ui/components/sheet";
import { Button } from "@snappin/ui/components/button";
import { Badge } from "@snappin/ui/components/badge";
import { useInvoiceFilterStore } from "./invoiceFilter.store";
import { trpc } from "@snappin/features/trpc/react/client";
import { MultiComboBox } from "@snappin/ui/components/input/components/multiComboboxInput";

// ─── Types ────────────────────────────────────────────────────────────────────

type PendingState = {
  vendorIds: string[];
  senderEmails: string[];
  recipientEmails: string[];
  currencies: string[];
  invoiceRecipients: string[];
};

type CategoryKey = "vendor" | "sender" | "recipient" | "currency" | "invoiceTo";

const CATEGORY_FIELD_MAP: Record<CategoryKey, keyof PendingState> = {
  vendor: "vendorIds",
  sender: "senderEmails",
  recipient: "recipientEmails",
  currency: "currencies",
  invoiceTo: "invoiceRecipients",
};

const EMPTY_PENDING: PendingState = {
  vendorIds: [],
  senderEmails: [],
  recipientEmails: [],
  currencies: [],
  invoiceRecipients: [],
};

function isCategoryKey(key: string): key is CategoryKey {
  return key in CATEGORY_FIELD_MAP;
}

function getPendingField(pending: PendingState, key: string): string[] {
  if (!isCategoryKey(key)) return [];
  return pending[CATEGORY_FIELD_MAP[key]];
}

export const FilterInvoice = () => {
  const {
    vendorIds,
    senderEmails,
    recipientEmails,
    currencies,
    invoiceRecipients,
    toggleVendor,
    toggleSender,
    toggleRecipient,
    toggleCurrency,
    toggleInvoiceRecipient,
    reset,
    hasActiveFilters,
    filterCount,
  } = useInvoiceFilterStore();

  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PendingState>(EMPTY_PENDING);

  const storeSnapshot = useRef({
    vendorIds,
    senderEmails,
    recipientEmails,
    currencies,
    invoiceRecipients,
  });
  storeSnapshot.current = {
    vendorIds,
    senderEmails,
    recipientEmails,
    currencies,
    invoiceRecipients,
  };

  useEffect(() => {
    if (open) {
      const s = storeSnapshot.current;
      setPending({
        vendorIds: [...s.vendorIds],
        senderEmails: [...s.senderEmails],
        recipientEmails: [...s.recipientEmails],
        currencies: [...s.currencies],
        invoiceRecipients: [...s.invoiceRecipients],
      });
    }
  }, [open]);

  // ── tRPC ──────────────────────────────────────────────────────────────────

  const { data: queryParams } = trpc.invoices.getQueryParams.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  );

  const {
    vendorOptions,
    senderOptions,
    recipientOptions,
    currencyOptions,
    invoiceRecipientOptions,
  } = useMemo(
    () => ({
      vendorOptions: queryParams?.vendorOptions ?? [],
      senderOptions: queryParams?.senderOptions ?? [],
      recipientOptions: queryParams?.recipientOptions ?? [],
      currencyOptions: queryParams?.currencies ?? [],
      invoiceRecipientOptions: queryParams?.invoiceRecipients ?? [],
    }),
    [queryParams],
  );

  // ── Category config ────────────────────────────────────────────────────────

  const categories = [
    {
      key: "vendor" as CategoryKey,
      label: "Vendor",
      placeholder: "All vendors",
      ReactIcon: HiOutlineOfficeBuilding,
      options: vendorOptions,
    },
    {
      key: "sender" as CategoryKey,
      label: "Sender",
      placeholder: "All senders",
      ReactIcon: HiOutlinePaperAirplane,
      options: senderOptions,
    },
    {
      key: "recipient" as CategoryKey,
      label: "Recipient",
      placeholder: "All recipients",
      ReactIcon: HiOutlineUser,
      options: recipientOptions,
    },
    {
      key: "currency" as CategoryKey,
      label: "Currency",
      placeholder: "All currencies",
      ReactIcon: HiOutlineCurrencyDollar,
      options: currencyOptions,
    },
    {
      key: "invoiceTo" as CategoryKey,
      label: "Invoice To",
      placeholder: "All entities",
      ReactIcon: HiOutlineDocumentText,
      options: invoiceRecipientOptions,
    },
  ];


  const pendingTotal = Object.values(pending).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  // ── Commit / clear ─────────────────────────────────────────────────────────

  const handleApply = () => {
    reset();
    pending.vendorIds.forEach(toggleVendor);
    pending.senderEmails.forEach(toggleSender);
    pending.recipientEmails.forEach(toggleRecipient);
    pending.currencies.forEach(toggleCurrency);
    pending.invoiceRecipients.forEach(toggleInvoiceRecipient);
    setOpen(false);
  };

  const handleClear = () => {
    setPending(EMPTY_PENDING);
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const active = hasActiveFilters();
  const count = filterCount();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="shadow-xs min-w-fit"
        onClick={() => setOpen(true)}
      >
        <HiOutlineFilter className={cn("size-3.5 text-muted-foreground")} />
        {active && (
          <Badge variant="mono" size="xs" className="rounded-full pl-0.5">
            {count}
          </Badge>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-0 gap-0 w-full sm:max-w-md">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
            <SheetTitle className="text-base font-semibold">
              Filter Invoices
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {pendingTotal === 0
                ? "No filters applied"
                : `${pendingTotal} filter${pendingTotal > 1 ? "s" : ""} applied`}
            </p>
          </SheetHeader>

          {/* ── Body ────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {categories.map((cat, i) => (
              <React.Fragment key={i}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {cat.label}
                    </label>
                  </div>
                  <MultiComboBox
                    placeholder={cat.placeholder}
                    options={cat.options}
                    value={getPendingField(pending, cat.key)}
                    onChange={(vals) => {
                      if (!isCategoryKey(cat.key)) return;
                      const field = CATEGORY_FIELD_MAP[cat.key];
                      setPending((prev) => ({ ...prev, [field]: vals }));
                    }}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div className="px-5 py-4 border-t border-border flex flex-col gap-2.5">
            <Button
              size="lg"
              radius="xl"
              className="w-full font-semibold"
              onClick={handleApply}
              variant="mono"
            >
              Apply{pendingTotal > 0 ? ` (${pendingTotal})` : ""}
            </Button>
            <Button
              size="lg"
              radius="xl"
              variant="ghost"
              className="w-full font-medium text-muted-foreground"
              onClick={handleClear}
            >
              Clear all
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
