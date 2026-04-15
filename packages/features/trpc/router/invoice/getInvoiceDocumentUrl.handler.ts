import { storageService } from "@snappin/infra/google/storage"
import { ContextProps } from "../../_trpc"
import { TGetInvoiceDocumentUrl } from "./getInvoiceDocumentUrl.schema"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

export type GetInvoiceDocumentUrl = {
    ctx: ContextProps
    input: TGetInvoiceDocumentUrl
}

export async function getInvoiceDocumentUrl({ ctx, input }: GetInvoiceDocumentUrl): Promise<{ url: string }> {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    const { documentId } = input

    if (!documentId) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "documentId is required",
        })
    }

    const url = await storageService.getSignedPdfUrl(documentId)

    if (!url) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" })
    }

    return { url }
}