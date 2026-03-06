"use client";

import { Icon } from "@iconify/react";
import { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Paragraph, Small } from "@snappin/ui/components/typography";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { Badge } from "@snappin/ui/components/badge";
import { SwitchInput } from "@snappin/ui/components/input/components/switchInput";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@snappin/ui/components/tooltip";
import { formatDate } from "@snappin/lib/date/formateDate";
import { Image } from "@snappin/ui/components/Image";

type IntegrationRow =
  RouterOutputs["integration"]["connectedEmailAccounts"][number];

const MonitoringCell = ({
  integrationId,
  monitored,
}: {
  integrationId: string;
  monitored: boolean;
}) => {
  const utils = trpc.useUtils();

  const updateMonitoring =
    trpc.integration.accounts.updateMonitoring.useMutation({
      onSuccess: () => {
        toast.success("Email monitoring updated successfully");
        utils.integration.connectedEmailAccounts.invalidate();
      },
      onError: () => {
        toast.error("Failed to update monitoring");
      },
    });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <SwitchInput
            className="cursor-pointer"
            checked={monitored}
            disabled={updateMonitoring.isPending}
            onChange={(val) =>
              updateMonitoring.mutate({ integrationId, mailMonitored: val })
            }
          />
        </div>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>
        {monitored
          ? "Click here to disable monitoring"
          : "Click here to enable monitoring"}
      </TooltipContent>
    </Tooltip>
  );
};

// const ActionsCell = ({
//   id,
//   appSlug,
// }: {
//   id: string;
//   appSlug?: AppSlug | null;
// }) => {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const utils = trpc.useUtils();
//   const openConfirm = useConfirmStore((s) => s.openConfirm);

//   const deleteIntegration = trpc.integration.removeIntegration.useMutation({
//     onSuccess: async () => {
//       toast.success("Account deleted successfully");
//       setIsDeleting(false);
//       await utils.integration.connectedEmailAccounts.invalidate();
//     },
//     onError: () => {
//       toast.error("Failed to delete account");
//       setIsDeleting(false);
//     },
//   });

//   const handleDelete = () => {
//     openConfirm({
//       title: "Delete Account",
//       description: "Are you sure that you want to delete this account?",
//       confirmLabel: "Delete",
//       destructive: true,
//       size: "sm",
//       onConfirm: () => {
//         if (!appSlug) return;
//         setIsDeleting(true);
//         deleteIntegration.mutate({ integrationId: id, appSlug });
//       },
//     });
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className="p-1">
//           <HugeiconsIcon icon={MoreHorizontalIcon} />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         side="right"
//         align="start"
//         sideOffset={6}
//         className="min-w-44"
//       >
//         <DropdownMenuItem
//           disabled={isDeleting}
//           className={cn(
//             "h-9 text-sm flex items-center gap-2",
//             "text-destructive data-highlighted:bg-red-50 data-highlighted:text-destructive",
//           )}
//           onSelect={(e) => {
//             e.preventDefault();
//             handleDelete();
//           }}
//         >
//           {isDeleting && (
//             <Icon icon="line-md:loading-twotone-loop" className="h-4 w-4" />
//           )}
//           Delete permanently
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

export const accountsColumn = (): ColumnDef<IntegrationRow>[] => [
  {
    id: "appSlug",
    header: "Account",
    size: 200,
    minSize: 140,
    cell: ({ row }) => (
      <div className="flex items-center gap-10 p-1">
        <div className="flex items-center gap-4">
          {/* Fix 2: cast appSlug to keyof typeof appMetadata */}
          <Image
            className="size-6 shrink-0"
            src={
              row.original.appSlug
                ? (appMetadata[row.original.appSlug]
                    ?.logoUrl ?? "")
                : ""
            }
            alt={row.original.appSlug ? appMetadata[row.original.appSlug].name + "'s logo" : "logo"}
          />
          <div>
            <Paragraph className="font-semibold text-gray-500">
              {row.original?.appSlug &&
                row.original.appSlug.charAt(0).toUpperCase() +
                  row.original.appSlug.slice(1)}
            </Paragraph>
            <Small className="text-[13px]! text-gray-500">
              {row.original.identifierEmail}
            </Small>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge appearance="outline" size="sm" className="capitalize">
        {row.original?.status &&
          row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    id: "lastActivity",
    header: () => <div className="text-end">Last Activity</div>,
    cell: ({ row }) => (
      <Small className="text-gray-500 text-end">
        {formatDate("MMM_DD_YYYY", row.original?.updatedAt)}
      </Small>
    ),
  },
];
