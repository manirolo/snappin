"use client";

import React from "react";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { Image } from "@snappin/ui/components/Image";
import { Button } from "@snappin/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogLabel,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import { formatDate } from "@snappin/lib/date/formateDate";
import { HiExternalLink } from "react-icons/hi";
import { HiOutlineClock } from "react-icons/hi";
import { DropdownMenuItem } from "@snappin/ui/components/dropdown-menu";
import { ScrollArea } from "@snappin/ui/components/scroll-area";

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

  const [open, setOpen] = React.useState(false); 
  const hasEntries = integrations && integrations.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          className="flex gap-1 items-center"
        >
          Export History
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogLabel>History</DialogLabel>
          <DialogTitle>Export History</DialogTitle>
          <DialogDescription>View all your document exports</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex flex-col gap-1 my-4 px-5 max-h-40">
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-bg-a2 cursor-pointer group transition-colors"
                    onClick={() => window.open(entry.url!, "_blank")}
                  >
                    <Image
                      className="size-8 object-contain shrink-0"
                      src={app?.logoUrl ?? ""}
                      alt={(app?.name ?? entry.appSlug ?? "") + "'s logo"}
                    />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-sm font-medium leading-tight truncate">
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

                    <div className="text-sm hidden group-hover:block text-link">
                      View
                    </div>
                  </div>
                );
              })
          )}
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="dim" size="lg" className="min-w-30">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
