// getInvoiceThumbnailUrl.ts
import { storageService } from "@snappin/infra/google/storage"
import { ContextProps } from "../../_trpc"
import { TGetInvoiceThumbnailUrl } from "./getInvoiceThumbnailUrl.schema"
import { TRPCError } from "@trpc/server"

export type GetInvoiceThumbnailUrl = {
    ctx: ContextProps
    input: TGetInvoiceThumbnailUrl
}

export async function getInvoiceThumbnailUrl({ input }: GetInvoiceThumbnailUrl): Promise<{ url: string }> {
    const { thumbnailId } = input

    if (!thumbnailId) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "thumbnailId is required",
        })
    }

    const url = await storageService.getSignedThumbnailUrl(thumbnailId)

    return { url }
}