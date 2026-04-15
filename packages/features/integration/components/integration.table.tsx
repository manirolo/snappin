// "use client";

// import { useState, useEffect } from "react";
// import {
//   getCoreRowModel,
//   getSortedRowModel,
//   SimpleTable,
//   SortingState,
//   useReactTable,
// } from "@snappin/ui/components/table";
// import { toast } from "react-hot-toast";
// import { integrationColumns } from "./integration.column";
// import { useIntegration } from "../hooks/useIntegration";
// import { AppSlug } from "@snappin/shared/apps/app.schema";
// import {
//   Empty,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@snappin/ui/components/empty";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { IceCubesIcon } from "@hugeicons-pro/core-bulk-rounded";

// const EmptyIntegrationStateComponent = () => {
//   return (
//     <Empty>
//       <EmptyHeader>
//         <EmptyMedia>
//           <HugeiconsIcon icon={IceCubesIcon} className="text-primary size-14" />
//         </EmptyMedia>
//         <EmptyTitle>No apps connected</EmptyTitle>
//         <EmptyDescription>
//           Capture, extract and categorize bills, receipts and more in seconds
//         </EmptyDescription>
//       </EmptyHeader>
//     </Empty>
//   );
// };

// export const IntegrationListTable = () => {
//   // const [tab, setTab] = useState<IntegrationTab>("all");
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});

//   const { integrations, isLoading, error } = useIntegration({
//     integrations: { enabled: true, appSlug: AppSlug.GOOGLE_DRIVE },
//   });

//   useEffect(() => {
//     if (error) {
//       toast.error("Something went wrong!");
//     }
//   }, [error]);

//   const integrationTable = useReactTable({
//     data: integrations?.data ?? [],
//     columns: integrationColumns(),
//     state: { sorting, columnVisibility, rowSelection },
//     onSortingChange: setSorting,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: (updater) => {
//       const next =
//         typeof updater === "function" ? updater(rowSelection) : updater;
//       setRowSelection(next);
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     enableRowSelection: true,
//   });

//   return (
//     <div>
//       <SimpleTable
//         table={integrationTable}
//         // toolbar={toolbar}
//         loading={isLoading}
//         emptyStateComponent={<EmptyIntegrationStateComponent />}
//       />
//     </div>
//   );
// };
