import { Icon } from "@iconify/react";
import { RouterOutputs } from "@snappin/api/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { appMetadata } from "@snappin/apps/app.metadata"
import { Paragraph } from "@snappin/ui/components/typography";
import { Badge, BadgeDot } from "@snappin/ui/components/badge";
import { Button } from "@snappin/ui/components/button";
import { Delete02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { trpc } from "@snappin/api/react/client";
import { AppSlug } from "@snappin/shared/apps/app.enum";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { useState } from "react";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import toast from "react-hot-toast";
import { formatDate } from "@snappin/lib/date/formateDate";

type IntegrationRow = RouterOutputs["integration"]["getIntegration"]["data"][number];

const ActionsCell = ({ id, appSlug }: {id: string; appSlug: AppSlug}) => {
    const openConfirm = useConfirmStore((s) => s.openConfirm);
    const [loading, setLoading] = useState<string | null>(null);

    const utils = trpc.useUtils()
    const deleteIntegration = trpc.integration.removeIntegration.useMutation({
        onSuccess() {
            toast.success("Integration deleted successfully")
            utils.integration.getIntegration.invalidate();
            setLoading(null)
        },
        onError(){
            setLoading(null)
            toast.error("Failed to delete integration")
        }
    })

    const removeIntegration = (integrationId: string, appSlug: AppSlug) => {
        openConfirm({
            // icon: <HugeiconsIcon icon={Delete01Icon} className="size-6"/>,
            title: "Delete integration",
            description: "Are you sure that you want to delete this integration?",
            confirmLabel: "Delete",
            destructive: true,
            size: "sm",
            onConfirm: () => {
                setLoading(integrationId)
                deleteIntegration.mutate({ integrationId, appSlug })
            },
        })
    }

    return(
        <div>
            <Button variant={"destructive"} size={"sm"} onClick={() => removeIntegration(id, appSlug)}>
                {loading ? <Spinner /> : <HugeiconsIcon icon={Delete02Icon} />}
            </Button>
        </div>
    )

};

export const integrationColumns = (): ColumnDef<IntegrationRow>[] => [
    {
        id: "appSlug",
        header: "",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Icon icon={appMetadata[row.original.appSlug].icon} />
                <Paragraph className="text-slate-400!">{row.original.identifierEmail}</Paragraph>
            </div>
        )
    },
    {
        id: "updated",
        header: "",
        cell: ({ row }) => <ActionsCell id={row.original._id} appSlug={row.original.appSlug} />
    }
];
