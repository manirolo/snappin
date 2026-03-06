"use client";

import React from "react";
import { Button } from "@snappin/ui/components/button";
import { Input } from "@snappin/ui/components/input";
import { Label } from "@snappin/ui/components/label";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { Icon } from "@iconify/react";
import { useIntegration } from "../../integration/hooks/useIntegration";
import { appMetadata } from "@snappin/apps/app.metadata";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@snappin/ui/components/dialog";
import ComboBox, {
  ComboBoxOption,
} from "@snappin/ui/components/input/components/comboboxInput";
import { Search01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "last-6-months", label: "Last 6 months" },
  { id: "custom", label: "Custom" },
] as const;

export const NewScanDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<string>("this-month");
  const [selectedEmail, setSelectedEmail] = React.useState<string>("");
  const [customFrom, setCustomFrom] = React.useState<string>("");
  const [customTo, setCustomTo] = React.useState<string>("");
  const utils = trpc.useUtils();

  const { connectedEmailAccounts } = useIntegration({
    connectedEmailAccounts: true,
  });

  const emailOptions: ComboBoxOption[] = (connectedEmailAccounts ?? []).map(
    (account) => ({
      value: account.identifierEmail ?? "",
      label: account.identifierEmail ?? "",
      icon: (
        <Icon
          icon={
            appMetadata[account.appSlug as keyof typeof appMetadata]
              ?.iconifyIcon ?? ""
          }
          className="h-4 w-4"
        />
      ),
      keywords: [account.appSlug ?? ""],
    }),
  );

  const getDateRange = (): { from: number; to: number } => {
    const now = new Date();
    const to = now.getTime();

    switch (range) {
      case "today": {
        const from = new Date(now.setHours(0, 0, 0, 0)).getTime();
        return { from, to };
      }
      case "this-month": {
        const from = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return { from, to };
      }
      case "last-month": {
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        const lastTo = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();
        return { from, to: lastTo };
      }
      case "last-6-months": {
        const from = new Date(now.getFullYear(), now.getMonth() - 6, 1).getTime();
        return { from, to };
      }
      case "custom": {
        return {
          from: new Date(customFrom).getTime(),
          to: new Date(customTo).getTime(),
        };
      }
      default:
        return { from: to, to };
    }
  };

  const scanInvoices = trpc.retroSearch.scanPastInvoices.useMutation({
    onSuccess: () => {
      utils.retroSearch.getScans.invalidate();
      toast.success("Scan started");
      setOpen(false);
    },
    onError: () => toast.error("Failed to start scan"),
  });

  const handleSubmit = () => {
    if (!selectedEmail) return toast.error("Please select an email account");
    if (range === "custom" && (!customFrom || !customTo))
      return toast.error("Please select a date range");

    const { from, to } = getDateRange();
    scanInvoices.mutate({ email: selectedEmail, from, to });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" radius="full">
          <HugeiconsIcon icon={Search01Icon} className="size-4" />
          Find past invoices
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Let's catch up missed invoices</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Email ComboBox */}
          <ComboBox
            label="Email account"
            placeholder="Select an account"
            searchPlaceholder="Search email..."
            emptyText="No account found."
            options={emailOptions}
            value={selectedEmail}
            onChange={(val) => setSelectedEmail(val)}
            showOptionValue={false}
            alphabetical={false}
          />

          {/* Date range buttons */}
          <div className="space-y-2">
            <Label>Select date range</Label>
            <div className="flex flex-wrap gap-2">
              {DATE_RANGES.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  radius="md"
                  variant={range === item.id ? "dim" : "outline"}
                  onClick={() => setRange(item.id)}
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom date inputs */}
          {range === "custom" && (
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                <Input
                  type="date"
                  className="hide-calendar-icon"
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
                to
                <Input
                  type="date"
                  className="hide-calendar-icon"
                  onChange={(e) => setCustomTo(e.target.value)}
                />
              </div>
              <ExtraSmall className="text-xs">
                Note: Range should not be longer than 6 months
              </ExtraSmall>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={scanInvoices.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={scanInvoices.isPending}>
            {scanInvoices.isPending && <Spinner className="size-4" />}
            Start scan now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};