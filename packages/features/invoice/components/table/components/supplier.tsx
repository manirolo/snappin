"use client";

import {
  Paragraph,
  Small,
} from "@snappin/ui/components/typography";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { truncateEnd } from "@snappin/lib/string/truncate";

type SupplierCellProps = {
  invoiceId: string;
  senderAddress?: string | null;
  vendorName?: string | null;
  subscription?: boolean;
  description?: string | null;
};

export function SupplierCell({
  senderAddress,
  vendorName,
  description,
}: SupplierCellProps) {
  return (
    <div className="flex items-center rounded-md gap-3 py-1 text-left">
      {getLogoByDomain(senderAddress ?? "snappin", "size-8.5 rounded-md!")}
      <div className="flex flex-col gap-0.5">
        <Paragraph className="text-sm text-foreground">
          {truncateEnd(vendorName ?? "Unknown", 25)}
        </Paragraph>
        <div className="flex items-center gap-2.5">
          {description && <Small className="text-xs! md:text-xs!">{truncateEnd(description, 25)}</Small>}
        </div>
      </div>
    </div>
  );
}
