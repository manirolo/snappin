"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  SimpleTable,
} from "@snappin/ui/components/table";
import { toast } from "react-hot-toast";
import { mobileScannersColumn } from "./mobileScanners.column.compact";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { LaptopPhoneSyncIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import { NewMobileScannerDialog } from "./newMobileScanner.dialog";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";
import { UpgradeButton } from "@snappin/features/billing/components/upgradeButton";
import { UsageStats } from "@snappin/features/billing/components/usageStats";

const EmptyConnectedAccountsStateComponent = () => {
  return (
    <Empty className="min-h-[10vh]">
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            icon={LaptopPhoneSyncIcon}
            strokeWidth={1.5}
            className={"size-9 text-fg-2"}
          />
        </EmptyMedia>
        <EmptyTitle>No Sources</EmptyTitle>
        <EmptyDescription>
          Connect your whatsapp number and start sending receipts directly from
          your mobile
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

// type IntegrationTab = "all" | "own" | "guest";

export const MobileScannersCompactListTable = ({
  onRowClick,
  disableAdding = false,
}: {
  onRowClick?: (invoiceId: string) => void;
  disableAdding?: boolean;
}) => {
  // const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState<boolean>(false);
  const { usage, isLoading: isUsageLoading } = useUsage();

  const { connectedMobileScanners, isLoading, error } = useIntegration({
    connectedMobileScanners: true,
  });

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const integrationTable = useReactTable({
    data: connectedMobileScanners ?? [],
    columns: mobileScannersColumn(),
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (
      connectedMobileScanners &&
      connectedMobileScanners?.length > 0 &&
      selectedIndex === null
    ) {
      setSelectedIndex(0);

      if (onRowClick && connectedMobileScanners[0]?._id) {
        onRowClick(connectedMobileScanners[0]._id);
      }
    }
  }, [connectedMobileScanners, selectedIndex, onRowClick]);

  return (
    <div className="bg-table w-full border border-bg-2 p-3 rounded-xl">
      <div className="p-2 flex justify-between items-center">
        <div className="flex flex-col gap-1 justify-between items-start">
          <h6 className="font-medium">Mobile Source</h6>
          <ExtraSmall>Send your receipts through mobile</ExtraSmall>
        </div>
        {!disableAdding && (
          <UpgradeButton
            popupId="mobile-scanner-dialog"
            isLoading={isUsageLoading}
            limitReached={
              !!(
                usage &&
                (usage.usage?.mobileScanners ?? 0) >=
                  (usage.limits?.mobileScanners ?? 0)
              )
            }
            onClick={() => setOpen(true)}
            description={`You've reached the limit of ${usage?.limits?.mobileScanners} whatsapp accounts. To connect more, upgrade to a higher plan.`}
          >
            <Button variant={"dim"} size="sm">
              Add mobile scanner
            </Button>
          </UpgradeButton>
        )}
      </div>
      <SimpleTable
        table={integrationTable}
        // toolbar={toolbar}

        // selectedRowIndex={selectedIndex}
        onRowClick={(row) => {
          const id = row.original?._id;
          const index = row.index;
          setSelectedIndex(index);
          if (onRowClick && id) {
            onRowClick(id);
          }
        }}
        className="shadow-none px-0 border-0"
        loading={isLoading}
        emptyStateComponent={<EmptyConnectedAccountsStateComponent />}
      />
      {integrationTable.getRowModel().rows.length > 0 && (
        <UsageStats
          id="mobile-scanner"
          usage={usage?.usage?.mobileScanners ?? 0}
          limit={usage?.limits?.mobileScanners ?? 0}
        />
      )}
      <NewMobileScannerDialog open={open} setOpen={setOpen} />
    </div>
  );
};
