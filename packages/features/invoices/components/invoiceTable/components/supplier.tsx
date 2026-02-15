"use client";

import { Small, ExtraSmall } from "@snappin/ui/components/typography";
import { getLogoByName } from "@snappin/ui/components/logo/getLogo";

type SupplierCellProps = {
  invoiceId: string;
  vendorName?: string;
  subscription?: boolean;
};

export function SupplierCell({vendorName,subscription}: SupplierCellProps) {
  return (
        <div className="flex items-center bg-amber-400 rounded-full gap-2 py-1 text-left">
          {getLogoByName(vendorName ?? "snappinapp")}
          <div className="flex flex-col">
            <Small className="text-foreground font-medium">
              {vendorName ?? "Unknown vendor"}
            </Small>
            {subscription && (
              <ExtraSmall className="text-xs text-muted-foreground">
                Subscription
              </ExtraSmall>
            )}
          </div>
        </div>
  );
}
