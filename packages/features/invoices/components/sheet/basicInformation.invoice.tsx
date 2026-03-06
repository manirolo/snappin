import { trpc } from "@snappin/features/trpc/react/client";
import React, { ReactNode, forwardRef, useImperativeHandle, useCallback, useMemo, useState } from "react";
import { TextInput } from "@snappin/ui/components/input/components/textInput";
import { AmountInput } from "@snappin/ui/components/input/amountInput";
import { SelectInput } from "@snappin/ui/components/input/components/selectInput";
import { SwitchInput } from "@snappin/ui/components/input/components/switchInput";
import { ComboBox } from "@snappin/ui/components/input/components/comboboxInput";
import {
  CURRENCY_OPTIONS,
  POPULAR_CURRENCY_VALUES,
} from "@snappin/ui/components/input/waste/currencyInput";
import VendorComboBox from "../../../vendor/components/input/vendorComboboxInput";
import DateInput from "@snappin/ui/components/input/components/dateInput";
import { INVOICE_TYPE_OPTIONS } from "@snappin/shared/invoice/constant";
import { isDeepDirty } from "@snappin/lib/dirty-check";
import currencyMap from "currency-symbol-map";
import { InvoiceDocumentResource } from "@snappin/shared/invoice/invoice.schema";
import { InvoicePatch } from "./invoiceDetail.sheet";
import { RouterOutputs } from "@snappin/features/trpc/_root";
import toast from "react-hot-toast";
import { H5 } from "@snappin/ui/components/typography";

type InvoiceData = RouterOutputs["invoices"]["getInvoice"];

export interface BasicInformationInvoiceHandle {
  save: () => void;
}

interface BasicInformationInvoiceProps {
  invoiceId: string;
  data: InvoiceData | undefined;
  /** Fires whenever isDirty or isSaving changes so the parent can re-render its Save button */
  onStateChange?: (state: { isDirty: boolean; isSaving: boolean }) => void;
}

const Layout = ({ children, title }: { title?: string; children?: ReactNode }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-2">
      <H5 className="font-semibold">{title}</H5>
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

export const BasicInformationInvoice = forwardRef<
  BasicInformationInvoiceHandle,
  BasicInformationInvoiceProps
>(({ invoiceId, data, onStateChange }, ref) => {
  const utils = trpc.useUtils();
  const [invoiceData, setInvoiceData] = useState<InvoicePatch>({});
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => {
    const vendorDirty =
      invoiceData.vendorId !== undefined &&
      isDeepDirty({ vendorId: data?.vendor?._id }, { vendorId: invoiceData.vendorId });
    const invoiceDirty =
      invoiceData.invoice !== undefined &&
      isDeepDirty(data?.invoice, invoiceData.invoice);
    return vendorDirty || invoiceDirty;
  }, [invoiceData, data]);

  // Notify parent on every dirty/saving change so the Save button re-renders
  React.useEffect(() => {
    onStateChange?.({ isDirty, isSaving });
  }, [isDirty, isSaving, onStateChange]);

  const { mutate: update } = trpc.invoices.updateInvoice.useMutation({
    onSuccess: () => {
      utils.invoices.getInvoices.invalidate();
      utils.invoices.getInvoice.invalidate({ invoiceId });
      setInvoiceData({});
      toast.success("Invoice updated");
    },
    onError: () => toast.error("Invoice update failed"),
    onSettled: () => setIsSaving(false),
  });

  // useCallback keeps the dep stable for useImperativeHandle
  const handleSave = useCallback(() => {
    if (!isDirty) return;
    setIsSaving(true);
    update({ invoiceId, data: invoiceData });
  }, [isDirty, invoiceId, invoiceData, update]);

  useImperativeHandle(ref, () => ({ save: handleSave }), [handleSave]);

  const { data: queryParams } = trpc.invoices.getQueryParams.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  const vendorOptions = useMemo(() => queryParams?.vendorOptions ?? [], [queryParams]);

  const saveInvoice = <K extends keyof InvoiceDocumentResource>(
    field: K,
    value: InvoiceDocumentResource[K],
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      invoice: { ...prev?.invoice, [field]: value } as InvoiceDocumentResource,
    }));
  };

  const amountPrefix =
    invoiceData?.invoice?.currency ??
    data?.invoice?.currency +
      "" +
      currencyMap(invoiceData?.invoice?.currency ?? data?.invoice?.currency ?? "usd");

  return (
    <div className="w-full relative overflow-y-auto">
      <div className="z-10 flex flex-col pl-1 gap-12 pb-24 w-full overflow-y-auto">
        <Layout title="General">
          <SelectInput
            label="Document Type"
            defaultValue={data?.invoice?.metadata?.documentType}
            options={INVOICE_TYPE_OPTIONS}
            onValueChange={(val) =>
              saveInvoice("metadata", {
                ...data?.invoice?.metadata,
                documentType: val as "invoice" | "receipt",
              })
            }
          />
          <TextInput
            label="Reference ID"
            value={invoiceData?.invoice?.invoiceId ?? data?.invoice?.invoiceId ?? ""}
            onChange={(val) => saveInvoice("invoiceId", val)}
          />
          <div className="grid grid-cols-2 gap-4 justify-between">
            <DateInput
              label="Invoice Date"
              value={invoiceData?.invoice?.invoiceDate ?? data?.invoice?.invoiceDate}
              onChange={(val) => saveInvoice("invoiceDate", val)}
            />
            <DateInput
              label="Due Date"
              value={invoiceData?.invoice?.dueDate ?? data?.invoice?.dueDate}
              onChange={(val) => saveInvoice("dueDate", val)}
            />
          </div>
        </Layout>

        <Layout title="Merchant">
          <VendorComboBox
            label="Merchant"
            value={invoiceData?.invoice?.vendorId ?? data?.vendor?._id ?? ""}
            options={vendorOptions}
            onChange={(id) => saveInvoice("vendorId", id)}
          />
        </Layout>

        <Layout title="Amount">
          <div className="grid grid-cols-2 gap-4">
            <AmountInput
              label="Sub Total"
              prefix={amountPrefix}
              value={invoiceData?.invoice?.subTotal ?? data?.invoice?.subTotal ?? 0}
              onChange={(val) => saveInvoice("subTotal", val)}
            />
            <AmountInput
              label="Tax"
              prefix={amountPrefix}
              value={invoiceData?.invoice?.tax?.taxAmount ?? data?.invoice?.tax?.taxAmount ?? 0}
              onChange={(val) => saveInvoice("tax", { taxAmount: val })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AmountInput
              label="Total"
              prefix={amountPrefix}
              value={data?.invoice?.total ?? 0}
              onChange={(val) => saveInvoice("total", val)}
            />
            <ComboBox
              label="Currency"
              value={invoiceData?.invoice?.currency ?? data?.invoice?.currency ?? "USD"}
              options={CURRENCY_OPTIONS}
              popularValues={POPULAR_CURRENCY_VALUES}
              popoverWidth="min-w-sm"
              onChange={(val) => saveInvoice("currency", val)}
            />
          </div>
        </Layout>

        <Layout title="Payment">
          <SwitchInput
            label="Already paid"
            size="lg"
            checked={
              (invoiceData?.invoice?.payment?.status ?? data?.invoice?.payment?.status) === "paid"
            }
            className="flex-row-reverse w-fit"
            onChange={(val) =>
              saveInvoice("payment", {
                ...data?.invoice?.payment,
                status: val ? "paid" : "unpaid",
              })
            }
          />
        </Layout>
      </div>
    </div>
  );
});

BasicInformationInvoice.displayName = "BasicInformationInvoice";