"use client";

import React from "react";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { Image } from "@snappin/ui/components/Image";
import { Button } from "@snappin/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import { formatDate } from "@snappin/lib/date/formateDate";
import { HiExternalLink } from "react-icons/hi";
import { HiOutlineClock } from "react-icons/hi";
import { DropdownMenuItem } from "@snappin/ui/components/dropdown-menu";

type ExportEntry = {
  integrationId?: string | null;
  appSlug?: string | null;
  url?: string | null;
  fileUrl?: string | null;
  externalId?: string | null;
  exportedAt?: number | null;
  error?: string | null;
};

type InvoiceExportHistoryProps = {
  integrations?: ExportEntry[] | null;
};

export const InvoiceExportHistory = ({
  integrations,
}: InvoiceExportHistoryProps) => {
  const hasEntries = integrations && integrations.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
          }}
          onSelect={(e) => e.preventDefault()} 
          className="flex gap-1 items-center"
        >
          Export History
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Export History</DialogTitle>
          <DialogDescription>View all your document exports</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-0 p-2">
          {!hasEntries ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No exports yet
            </p>
          ) : (
            integrations
              .slice()
              .sort((a, b) => (b.exportedAt ?? 0) - (a.exportedAt ?? 0))
              .map((entry, index) => {
                const app = appMetadata[entry.appSlug as AppSlug];
                return (
                  <div
                    key={`${entry.integrationId}-${entry.externalId}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-table"
                  >
                    <Image
                      className="size-6 shrink-0"
                      src={app?.logoUrl ?? ""}
                      alt={(app?.name ?? entry.appSlug ?? "") + "'s logo"}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="text-sm font-medium">
                        {app?.name ?? entry.appSlug}
                      </span>
                      {entry.exportedAt && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(
                            "MMM_DD_YYYY",
                            new Date(entry.exportedAt).toISOString(),
                          )}
                        </span>
                      )}
                      {entry.error && (
                        <span className="text-xs text-destructive">
                          {entry.error}
                        </span>
                      )}
                    </div>
                    {entry.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(entry.url!, "_blank")}
                      >
                        <HiExternalLink />
                        View
                      </Button>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
