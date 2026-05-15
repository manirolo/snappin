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
import { accountsColumn } from "./account.column.compact";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { useAccounts } from "../hooks/useInvoices";
import { SelectProvider } from "./selectProvider";
import { AiMail02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@snappin/ui/components/button";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";
import { UpgradeButton } from "@snappin/features/billing/components/upgradeButton";
import { InviteDialog } from "./invite/invite.dialog";
import { UsageStats } from "@snappin/features/billing/components/usageStats";

const EmptyConnectedAccountsStateComponent = () => {
  return (
    <Empty className="min-h-[10vh]">
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            icon={AiMail02Icon}
            strokeWidth={1.5}
            className={"size-9 text-fg-2"}
          />
        </EmptyMedia>
        <EmptyTitle>No Sources</EmptyTitle>
        <EmptyDescription>
          Connect your Gmail or outlook accounts to extract invoices
          automatically
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

// type IntegrationTab = "all" | "own" | "guest";

export const AccountsCompactListTable = ({
  onRowClick,
  disableAdding = false,
  disableInvite = false,
}: {
  onRowClick?: (invoiceId: string) => void;
  disableAdding?: boolean;
  disableInvite?: boolean;
}) => {
  // const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState<boolean>(false);

  const { accounts, isLoading, error } = useAccounts();
  const { usage, isLoading: isUsageLoading } = useUsage();

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const integrationTable = useReactTable({
    data: accounts ?? [],
    columns: accountsColumn(),
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
    if (accounts && accounts?.length > 0 && selectedIndex === null) {
      setSelectedIndex(0);

      if (onRowClick && accounts[0]?._id) {
        onRowClick(accounts[0]._id);
      }
    }
  }, [accounts, selectedIndex, onRowClick]);

  return (
    <div className="bg-table w-full border border-bg-2 p-3 rounded-xl">
      <div className="p-2 flex justify-between items-center">
        <div className="flex flex-col gap-1 font-medium">
          <h6 className="font-medium">Email Source</h6>
          <ExtraSmall>Invoices auto extracted from mails</ExtraSmall>
        </div>
        <div className="flex items-center gap-2">
          {!disableInvite && <InviteDialog />}
          {!disableAdding && (
            <UpgradeButton
              popupId="email-account-dialog"
              isLoading={isUsageLoading}
              limitReached={
                !!(
                  usage &&
                  (usage.usage?.emailAccounts ?? 0) >=
                    (usage.limits?.emailAccounts ?? 0)
                )
              }
              onClick={() => setOpen(true)}
              description={`You've reached the limit of ${usage?.limits?.emailAccounts} accounts. To connect more, upgrade to a higher plan.`}
            >
              <Button variant={"dim"} size="sm">
                Add account
              </Button>
            </UpgradeButton>
          )}
        </div>
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
      <div>
        {integrationTable.getRowModel().rows.length > 0 && (
          <UsageStats
            id="account"
            usage={usage?.usage?.emailAccounts ?? 0}
            limit={usage?.limits?.emailAccounts ?? 0}
          />
        )}
      </div>

      <SelectProvider
        open={open}
        setOpen={setOpen}
        redirectAfterPath="/dashboard"
      />
    </div>
  );
};
