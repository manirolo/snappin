// import { Icon } from "@iconify/react";
// import { RouterOutputs } from "@snappin/features/trpc/_root";
// import { ColumnDef } from "@snappin/ui/components/table";
// import { appMetadata } from "@snappin/apps/app.metadata";
// import { Paragraph } from "@snappin/ui/components/typography";
// import { Button } from "@snappin/ui/components/button";
// import { trpc } from "@snappin/features/trpc/react/client";
// import { AppSlug } from "@snappin/shared/apps/app.schema";
// import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
// import { useState } from "react";
// import { Spinner } from "@snappin/ui/assets/svg/spinner";
// import toast from "react-hot-toast";
// import { HiOutlineCog, HiOutlineTrash } from "react-icons/hi";
// import { Badge } from "@snappin/ui/components/badge";
// import { capitalize } from "@snappin/lib/string/capitalize";
// import { useRouter } from "next/navigation"

// type IntegrationRow =
//   RouterOutputs["integration"]["getIntegration"]["data"][number];

// const ActionsCell = ({
//   id,
//   appSlug,
// }: {
//   id?: string | null;
//   appSlug?: AppSlug | null;
// }) => {
//   const openConfirm = useConfirmStore((s) => s.openConfirm);
//   const [loading, setLoading] = useState<string | null>(null);
//   const router = useRouter();

//   const utils = trpc.useUtils();
//   const deleteIntegration = trpc.integration.removeIntegration.useMutation({
//     onSuccess() {
//       toast.success("Integration deleted successfully");
//       utils.integration.getIntegration.invalidate();
//       setLoading(null);
//     },
//     onError() {
//       setLoading(null);
//       toast.error("Failed to delete integration");
//     },
//   });

//   const removeIntegration = (integrationId: string, appSlug: AppSlug) => {
//     openConfirm({
//       // icon: <HugeiconsIcon icon={Delete01Icon} className="size-6"/>,
//       title: "Delete integration",
//       description: "Are you sure that you want to delete this integration?",
//       confirmLabel: "Delete",
//       destructive: true,
//       size: "sm",
//       onConfirm: () => {
//         setLoading(integrationId);
//         deleteIntegration.mutate({ integrationId, appSlug });
//       },
//     });
//   };

//   if (!id || !appSlug) return;

//   return (
//     <div className="flex gap-2 items-center">
//       <Button variant="dim" size="sm" onClick={() => router.push("/integrations/" + id)}>
//         <HiOutlineCog />
//         Settings
//       </Button>
//       <Button
//         variant={"destructive"}
//         size={"sm"}
//         onClick={() => removeIntegration(id, appSlug)}
//       >
//         {loading ? <Spinner /> : <HiOutlineTrash />}
//       </Button>
//     </div>
//   );
// };

// export const integrationColumns = (): ColumnDef<IntegrationRow>[] => [
//   {
//     id: "appSlug",
//     header: "Integration",
//     meta: { disableHover: true },
//     cell: ({ row }) => (
//       <div className="flex items-center gap-2">
//         <Icon
//           icon={
//             row.original.appSlug
//               ? appMetadata[row?.original?.appSlug as ].iconifyIcon
//               : ""
//           }
//         />
//         <Paragraph>
//           {row.original.appSlug ? appMetadata[row?.original?.appSlug].name : ""}
//         </Paragraph>
//       </div>
//     ),
//   },
//   {
//     id: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <Badge appearance="outline">
//         {capitalize(row.original.status ?? "Unknown")}
//       </Badge>
//     ),
//   },
//   {
//     id: "detail",
//     header: "Details",
//     cell: ({ row }) => <div>{row.original.identifierEmail ?? "N/A"}</div>,
//   },
//   {
//     id: "updated",
//     header: "",
//     cell: ({ row }) => (
//       <ActionsCell id={row.original._id} appSlug={row.original.appSlug} />
//     ),
//   },
// ];
