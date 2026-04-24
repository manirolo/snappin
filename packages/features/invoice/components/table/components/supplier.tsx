"use client";

import { Paragraph, Small } from "@snappin/ui/components/typography";
import {
  getLogoByDomain,
  getLogoByName,
} from "@snappin/ui/components/logo/getLogo";
import { truncateEnd } from "@snappin/lib/string/truncate";

type SupplierCellProps = {
  invoiceId: string;
  senderAddress?: string | null;
  senderWebsite?: string | null;
  vendorName?: string | null;
  subscription?: boolean;
  description?: string | null;
};

// cleanDomainForLogo — also reject plain domain-looking strings that are actually company names
export function cleanDomainForLogo(value?: string | null): string | null {
  if (!value) return null;

  // Email — extract domain
  if (value.includes("@")) {
    const domain = value.split("@")[1]?.toLowerCase();
    const generic = [
      "gmail.com",
      "outlook.com",
      "yahoo.com",
      "hotmail.com",
      "icloud.com",
    ];
    if (domain && generic.includes(domain)) return null;
    return domain ?? null;
  }

  // Full URL — strip to hostname
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const hostname = url.hostname.replace("www.", "");
    // ✅ Must have a valid TLD — reject plain names
    if (!hostname.includes(".")) return null;
    return hostname;
  } catch {
    return null; // plain company name — let getLogoByName handle it
  }
}

export function SupplierCell({
  senderAddress,
  vendorName,
  description,
}: SupplierCellProps) {
  const rawDomain = senderAddress;
  const cleanedDomain = cleanDomainForLogo(rawDomain);
  console.log(cleanedDomain, " for ", vendorName);

  return (
    <div className="flex items-center rounded-md gap-3 py-1 text-left">
      {
        cleanedDomain
          ? getLogoByDomain(cleanedDomain, "size-6 rounded-md!") // ✅ valid domain
          : getLogoByName(vendorName ?? "unknown",  "size-6 rounded-md!") // ✅ fallback to name
      }
      <div className="flex flex-col gap-0.5">
        <Paragraph className="text-sm text-foreground">
          {truncateEnd(vendorName ?? "Unknown", 25)}
        </Paragraph>
        <div className="items-center hidden gap-2.5">
          {description && (
            <Small className="text-xs! md:text-xs!">
              {truncateEnd(description, 25)}
            </Small>
          )}
        </div>
      </div>
    </div>
  );
}
