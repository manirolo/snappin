import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { ScrollArea } from "@snappin/ui/components/scroll-area";
import { InlineField } from "@snappin/ui/components/input/waste/inlineField";
import { InlineAmountField } from "@snappin/ui/components/input/waste/inlineAmountField";
import { formatMinorAmount } from "@snappin/lib/amount/formatMinorAmount";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@snappin/ui/components/table";
import { Small } from "@snappin/ui/components/typography";
import { LineItemsResource } from "@snappin/shared/invoice/invoice.schema";
import toast from "react-hot-toast";
import currencyMap from "currency-symbol-map";
import { truncateFirstWord } from "@snappin/lib/string/truncate";

type InvoiceData = RouterOutputs["invoices"]["getInvoice"];

export interface LineItemsInvoiceHandle {
  save: () => void;
}

interface LineItemsInvoiceProps {
  invoiceId: string;
  data: InvoiceData | undefined;
  onStateChange?: (state: { isDirty: boolean; isSaving: boolean }) => void;
}

export const LineItemsInvoice = forwardRef<LineItemsInvoiceHandle, LineItemsInvoiceProps>(
  ({ invoiceId, data, onStateChange }, ref) => {
    const utils = trpc.useUtils();
    const currency = data?.totals?.currency ?? "USD";
    const sym = currencyMap(currency) ?? currency;

    const [items, setItems] = useState<Partial<LineItemsResource>[]>(
      () => (data?.lineItems as Partial<LineItemsResource>[]) ?? [],
    );
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    // Reset when invoice changes
    useEffect(() => {
      setItems((data?.lineItems as Partial<LineItemsResource>[]) ?? []);
      setDirty(false);
    }, [invoiceId, data?.lineItems]);

    // Notify parent on dirty/saving change
    useEffect(() => {
      onStateChange?.({ isDirty: dirty, isSaving: saving });
    }, [dirty, saving, onStateChange]);

    const { mutate: update } = trpc.invoices.updateInvoice.useMutation({
      onSuccess: () => {
        utils.invoices.getInvoices.invalidate();
        utils.invoices.getInvoice.invalidate({ invoiceId });
        setDirty(false);
        toast.success("Line items updated");
      },
      onError: () => toast.error("Failed to update line items"),
      onSettled: () => setSaving(false),
    });

    const patch = (index: number, field: keyof LineItemsResource, value: unknown) => {
      setItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
      setDirty(true);
    };

    const handleSave = useCallback(() => {
      if (!dirty) return;
      setSaving(true);
      update({ invoiceId, data: { lineItems: items as LineItemsResource[] } });
    }, [dirty, invoiceId, items, update]);

    useImperativeHandle(ref, () => ({ save: handleSave }), [handleSave]);

    const isEmpty = items.length === 0;
    const firstCell = "pl-8";
    const lastCell = "pr-8";

    return (
      <div className="w-full mt-4 relative">
        <ScrollArea className="h-[80vh]">
          <div className="pb-28">
            {isEmpty ? (
              <div className="flex items-center justify-center h-40 px-8">
                <Small>No line items found</Small>
              </div>
            ) : (
              <Table className="text-xs w-full table-fixed">
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className={`${firstCell} text-muted-foreground text-sm font-medium w-[10%]`}>
                      No.
                    </TableHead>
                    <TableHead className={`${firstCell} text-muted-foreground text-sm font-medium w-[45%]`}>
                      Item
                    </TableHead>
                    <TableHead className="text-muted-foreground text-sm font-medium w-[20%] text-right">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground text-sm font-medium w-[17.5%] text-right">
                      Tax
                    </TableHead>
                    <TableHead className={`${lastCell} text-muted-foreground text-sm font-medium w-[17.5%] text-right`}>
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item, i) => (
                    <TableRow
                      key={i}
                      className="border-b border-border hover:bg-transparent align-top"
                    >
                      <TableCell className="py-3 text-right text-muted-foreground/40">
                        {i + 1}
                      </TableCell>

                      <TableCell className={`${firstCell} py-3`}>
                        <InlineField
                          value={item.description}
                          displayName={truncateFirstWord(item.description ?? "")}
                          onChange={(v) => patch(i, "description", v)}
                          placeholder="Item name"
                          className="font-medium text-foreground"
                        />
                      </TableCell>

                      <TableCell className="py-3 text-right text-muted-foreground/40">–</TableCell>

                      <TableCell className="py-3">
                        <div className="flex justify-end">
                          <InlineAmountField
                            value={item.tax?.amount}
                            prefix={sym}
                            onChange={(v) => patch(i, "tax", { ...item.tax, amount: v })}
                          />
                        </div>
                      </TableCell>

                      <TableCell className={`${lastCell} py-3`}>
                        <InlineAmountField
                          value={item.total}
                          prefix={sym}
                          className="text-end"
                          onChange={(v) => patch(i, "total", v)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isEmpty && (
              <div className="flex flex-col items-end gap-4 mt-3 pt-3 pr-8">
                {data?.totals?.subtotal != null && (
                  <div className="flex gap-10">
                    <Small>Subtotal</Small>
                    <Small>{sym}{formatMinorAmount(data.totals?.subtotal)}</Small>
                  </div>
                )}
                {data?.totals?.tax?.amount != null && (
                  <div className="flex gap-10">
                    <Small>Tax</Small>
                    <Small>{sym}{formatMinorAmount(data.totals?.tax?.amount)}</Small>
                  </div>
                )}
                {data?.totals?.total != null && (
                  <div className="flex gap-10 font-semibold">
                    <span>Total</span>
                    <span>{sym}{formatMinorAmount(data.totals?.total)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  },
);

LineItemsInvoice.displayName = "LineItemsInvoice";