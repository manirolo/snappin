import { ContextProps } from "@snappin/trpc/_trpc"

export type UpdateInvoice = {
    ctx: ContextProps
}

export async function updateInvoice({ctx}: UpdateInvoice){
    console.log(ctx)
}