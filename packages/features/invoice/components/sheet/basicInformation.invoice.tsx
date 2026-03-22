import { trpc } from "@snappin/features/trpc/react/client";
import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useState,
} from "react";
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
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import { RouterOutputs } from "@snappin/features/trpc/_root";
import toast from "react-hot-toast";
import { H5 } from "@snappin/ui/components/typography";

type InvoiceData = RouterOutputs["invoices"]["getInvoice"];
type InvoicePatch = {
  [K in keyof InvoiceResource]?: NonNullable<InvoiceResource[K]> | undefined;
};

export interface BasicInformationInvoiceHandle {
  save: () => void;
}

interface BasicInformationInvoiceProps {
  invoiceId: string;
  data: InvoiceData | undefined;
  /** Fires whenever isDirty or isSaving changes so the parent can re-render its Save button */
  onStateChange?: (state: { isDirty: boolean; isSaving: boolean }) => void;
}

const Layout = ({
  children,
  title,
}: {
  title?: string;
  children?: ReactNode;
}) => (
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
      isDeepDirty(
        { vendorId: data?.vendor?._id },
        { vendorId: invoiceData.vendorId },
      );
    const invoiceDirty =
      invoiceData !== undefined && isDeepDirty(data, invoiceData);
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

  const { data: queryParams } = trpc.invoices.getQueryParams.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  );

  const vendorOptions = useMemo(
    () => queryParams?.vendorOptions ?? [],
    [queryParams],
  );

  const saveInvoice = <K extends keyof InvoiceResource>(
    field: K,
    value: InvoiceResource[K],
  ) => {
    setInvoiceData((prev: InvoicePatch) => ({
      ...prev,
      [field]: value,
    }));
  };

  const amountPrefix =
    (invoiceData?.totals?.currency ?? data?.totals?.currency ?? "") +
    currencyMap(
      invoiceData?.totals?.currency ?? data?.totals?.currency ?? "USD",
    );

  return (
    <div className="w-full relative overflow-y-auto">
      <div className="z-10 flex flex-col px-1 gap-12 pb-24 w-full overflow-y-auto">
        <Layout title="General">
          <SelectInput
            label="Document Type"
            defaultValue={data?.metadata?.documentType}
            options={INVOICE_TYPE_OPTIONS}
            onValueChange={(val) =>
              saveInvoice("metadata", {
                ...data?.metadata,
                documentType: val as "invoice" | "receipt",
              })
            }
          />
          <TextInput
            label="Reference ID"
            value={invoiceData?.invoiceId ?? data?.invoiceId ?? ""}
            onChange={(val) => saveInvoice("invoiceId", val)}
          />
          <div className="grid grid-cols-2 gap-4 justify-between">
            <DateInput
              label="Invoice Date"
              value={invoiceData?.invoiceDate ?? data?.invoiceDate}
              onChange={(val) => saveInvoice("invoiceDate", val)}
            />
            <DateInput
              label="Due Date"
              value={invoiceData?.dueDate ?? data?.dueDate}
              onChange={(val) => saveInvoice("dueDate", val)}
            />
          </div>
        </Layout>

        <Layout title="Merchant">
          <VendorComboBox
            label="Merchant"
            value={invoiceData?.vendorId ?? data?.vendor?._id ?? ""}
            options={vendorOptions}
            onChange={(id) => saveInvoice("vendorId", id)}
          />
        </Layout>

        <Layout title="Amount">
          <div className="grid grid-cols-2 gap-4">
            <AmountInput
              label="Sub Total"
              prefix={amountPrefix}
              value={
                invoiceData?.totals?.subtotal ?? data?.totals?.subtotal ?? 0
              }
              onChange={(val) =>
                saveInvoice("totals", {
                  ...data?.totals,
                  ...invoiceData?.totals,
                  subtotal: val,
                })
              }
            />
            <AmountInput
              label="Tax"
              prefix={amountPrefix}
              value={
                invoiceData?.totals?.tax?.amount ??
                data?.totals?.tax?.amount ??
                0
              }
              onChange={(val) =>
                saveInvoice("totals", {
                  ...data?.totals,
                  ...invoiceData?.totals,
                  tax: {
                    ...data?.totals?.tax,
                    ...invoiceData?.totals?.tax,
                    amount: val,
                  },
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AmountInput
              label="Total"
              prefix={amountPrefix}
              value={invoiceData?.totals?.total ?? data?.totals?.total ?? 0}
              onChange={(val) =>
                saveInvoice("totals", {
                  ...data?.totals,
                  ...invoiceData?.totals,
                  total: val,
                })
              }
            />
            <ComboBox
              label="Currency"
              value={
                invoiceData?.totals?.currency ?? data?.totals?.currency ?? "USD"
              }
              options={CURRENCY_OPTIONS}
              popularValues={POPULAR_CURRENCY_VALUES}
              popoverWidth="min-w-sm"
              onChange={(val) =>
                saveInvoice("totals", {
                  ...data?.totals,
                  ...invoiceData?.totals,
                  currency: val,
                })
              }
            />
          </div>
        </Layout>

        <Layout title="Payment">
          <SwitchInput
            label="Already paid"
            size="lg"
            checked={
              (invoiceData?.payment?.status ?? data?.payment?.status) === "paid"
            }
            className="flex-row-reverse w-fit nb-20"
            onChange={(val) =>
              saveInvoice("payment", {
                ...data?.payment,
                ...invoiceData?.payment,
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