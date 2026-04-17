import { cn } from "@snappin/ui/lib/utils";
import React from "react";
import Link from "next/link";
import { env } from "@snappin/env";
import { useOrganization } from "@clerk/nextjs"

export type UsageState = {
  usage: number;
  limit: number;
  label?: string;
  id: string;
  enableWarnRunOutOfCredits?: boolean;
};

export const UsageStats = ({
  label,
  usage,
  enableWarnRunOutOfCredits = false,
  limit,
  id,
}: UsageState) => {
  const { membership } = useOrganization()
  return (
    <div>
      <span
        className={cn(
          "text-xs font-normal text-fg-2 gap-2",
          enableWarnRunOutOfCredits && usage >= limit && "text-destructive",
        )}
      >
        <span>
          {label ?? "Connected"} {usage} / {limit}
        </span>{" "}
        {usage >= limit && membership?.role == "org:admin" && <Link href={`/pricing?utm_medium=${id ?? "default"}-usage-info&utm_source=${env.app.frontend_url}`} className="text-link">- Upgrade</Link>}
      </span>
    </div>
  );
};
