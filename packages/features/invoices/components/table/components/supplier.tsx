"use client";

import {
  ExtraSmall,
  Paragraph,
} from "@snappin/ui/components/typography";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";

type SupplierCellProps = {
  invoiceId: string;
  senderAddress?: string | null;
  vendorName?: string | null;
  subscription?: boolean;
};

export function SupplierCell({
  senderAddress,
  subscription,
  vendorName,
}: SupplierCellProps) {
  return (
    <div className="flex items-center rounded-full gap-3 py-1 text-left">
      {getLogoByDomain(senderAddress ?? "snappin", "size-7")}
      <div className="flex flex-col gap-0.5">
        <Paragraph className="text-base text-foreground">
          {vendorName ?? "Unknown"}
        </Paragraph>
        <div className="flex items-center gap-2">
          <ExtraSmall>Payment for ride</ExtraSmall>
          {subscription && (
            <ExtraSmall className="text-xs text-muted-foreground">
              (Recurring)
            </ExtraSmall>
          )}
        </div>
      </div>
    </div>
  );
}
