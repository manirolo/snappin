"use client";

import React from "react";
import { DashboardDetailPanel } from "../../../components/layout/dashboardLayout";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { formatDate } from "@snappin/lib/date/formateDate";
import { formatMinorAmount } from "@snappin/lib/amount/formatMinorAmount";
import currencyMap from "currency-symbol-map";
import { trpc } from "@snappin/features/trpc/react/client";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { getDomainFromEmail } from "@snappin/features/invoices/utils/getDomainFromEmail";
import {
  DetailCard,
  DetailCardAction,
  DetailCardDescription,
  DetailCardFooter,
  DetailCardLogo,
  DetailCardSection,
  DetailCardHeader,
  DetailRow,
  DetailCardActionGroup,
} from "@snappin/ui/components/detailCard";
import {
  HiOutlineLink,
  HiOutlinePencilAlt,
  HiOutlineReply,
  HiOutlineTrash,
} from "react-icons/hi";
import { capitalize } from "@snappin/lib/string/capitalize";
import { useRouter } from "next/navigation";
import { DashboardLoading } from "../../../components/progress/loading";
import { truncateEnd } from "@snappin/lib/string/truncate";

export const InvoiceDetail = ({ invoiceId }: { invoiceId: string }) => {
  const router = useRouter();
  const { data: invoice, isLoading } = trpc.invoices.getInvoice.useQuery(
    { invoiceId },
    { enabled: !!invoiceId },
  );

  if (isLoading) return <DashboardLoading />;

  if (!invoice) return null;

  const senderAddress =
    invoice?.extraction?.source?.kind === SourceKind.INTEGRATION &&
    invoice?.extraction?.source?.metadata?.from
      ? getDomainFromEmail(invoice.extraction.source.metadata.from)
      : invoice?.vendor?.name;

  const sourceName =
    invoice?.extraction?.source?.kind == SourceKind.MANUAL &&
    "Manual Upload via UI";

  return (
    <DashboardDetailPanel>
      <DetailCard>
        <DetailCardHeader className="flex flex-row items-center w-full!">
          <DetailCardLogo>
            {getLogoByDomain(senderAddress ?? "unknown", "size-12", "text-lg")}
          </DetailCardLogo>
          <div>
            <p className="text-xl font-semibold">
              {truncateEnd(invoice.vendor?.name ?? "")}
            </p>
            <DetailCardDescription>
              {invoice.invoice?.invoiceDate
                ? formatDate("MMM_DD_YYYY", invoice.invoice.invoiceDate)
                : "—"}
            </DetailCardDescription>
          </div>
        </DetailCardHeader>

        <DetailCardSection>
          <DetailRow label="Ref. ID" value={invoice?.invoice?.invoiceId} />
          <DetailRow
            label="Due date"
            value={
              invoice.invoice?.dueDate
                ? formatDate("MMM_DD_YYYY", invoice.invoice.dueDate)
                : "—"
            }
          />
        </DetailCardSection>

        <DetailCardSection>
          {invoice?.vendor?.name && (
            <DetailRow label="Vendor Name" value={invoice?.vendor?.name} />
          )}
          {invoice?.vendor?.legalName && (
            <DetailRow
              label="Vendor Legal Name"
              value={invoice?.vendor?.legalName}
            />
          )}
          {invoice?.vendor?.businessRegistrationId && (
            <DetailRow
              label="Vendor Reg. ID"
              value={invoice?.vendor?.businessRegistrationId ?? "—"}
            />
          )}
          {invoice?.vendor?.country && (
            <DetailRow
              label="Vendor Country"
              value={invoice?.vendor?.country ?? "—"}
            />
          )}
          {invoice?.vendor?.website && (
            <DetailRow
              label="Vendor Address"
              value={invoice?.vendor?.website ?? "—"}
            />
          )}
        </DetailCardSection>

        <DetailCardSection>
          <DetailRow
            label="Sub Total"
            value={
              currencyMap(invoice?.invoice?.currency ?? "usd") +
              formatMinorAmount(invoice?.invoice?.subTotal)
            }
          />
          <DetailRow
            label="Tax"
            value={
              currencyMap(invoice?.invoice?.currency ?? "usd") +
              formatMinorAmount(invoice?.invoice?.tax?.taxAmount)
            }
          />
          <DetailRow
            label="Total"
            value={
              currencyMap(invoice?.invoice?.currency ?? "usd") +
              formatMinorAmount(invoice?.invoice?.total)
            }
          />
        </DetailCardSection>

        <DetailCardSection>
          <DetailRow
            label="Status"
            value={capitalize(invoice?.invoice?.payment?.status ?? "—")}
          />
          <DetailRow
            label="Payment"
            value={capitalize(invoice?.invoice?.payment?.paymentMethod ?? "—")}
          />
        </DetailCardSection>

        <DetailCardSection>
          <DetailRow label="Source" value={sourceName} />
          <DetailRow label="Identity" value={sourceName} />
        </DetailCardSection>

        <DetailCardFooter>
          <DetailCardActionGroup>
            <DetailCardAction
              icon={<HiOutlinePencilAlt size={16} />}
              label="Edit"
              onClick={() => router.push("documents/" + invoiceId + "/edit")}
            />
            <DetailCardAction
              icon={<HiOutlineReply size={16} />}
              label="Export to"
            />
            <DetailCardAction
              icon={<HiOutlineLink size={16} />}
              label="Share"
            />
          </DetailCardActionGroup>
          <DetailCardActionGroup>
            <DetailCardAction
              icon={<HiOutlineTrash size={16} />}
              label="Delete permanently"
              variant="destructive"
            />
          </DetailCardActionGroup>
        </DetailCardFooter>

        {/* <div className="space-y-1">
          <p className="text-xl font-onest tracking-tight font-semibold">
            {invoice.vendor?.name}
          </p>

          <p className="text-sm font-onest text-muted-foreground">
            {invoice.invoice?.invoiceDate
              ? formatDate("MMM_DD_YYYY", invoice.invoice.invoiceDate)
              : "—"}
          </p>

          <p className="text-xl font-onest mt-4 font-semibold text-foreground">
            {currencyMap(invoice.invoice?.currency ?? "usd")}
            {formatMinorAmount(invoice.invoice?.total)}
          </p>
        </div> */}
      </DetailCard>
    </DashboardDetailPanel>
  );
};
