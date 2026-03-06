import { storageService } from "@snappin/infra/google/storage"
import { ContextProps } from "../../_trpc"
import { TGetInvoiceDocumentUrl } from "./getInvoiceDocumentUrl.schema"
import { TRPCError } from "@trpc/server"

export type GetInvoiceDocumentUrl = {
    ctx: ContextProps
    input: TGetInvoiceDocumentUrl
}

export async function getInvoiceDocumentUrl({ input }: GetInvoiceDocumentUrl): Promise<{ url: string }> {
    const { documentId } = input

    if (!documentId) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "documentId is required",
        })
    }

    const url = await storageService.getSignedPdfUrl(documentId)

    return { url }
}