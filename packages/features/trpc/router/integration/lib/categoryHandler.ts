// categoryHandlers.ts
import { AppCategory } from "@snappin/shared/apps/app.schema"
import { TAddIntegration } from "../addIntegration.schema"
import { ContextProps } from "@snappin/features/trpc/_trpc"
import { OAuthSessionResource } from "@snappin/shared/auth/oauthSession.schema"
import { addAccounting } from "../accounting/addAccounting.handler"
import { addStorage } from "../storage/addStorage.handler"

export const categoryHandlers: Partial<Record<AppCategory,
    (args: { ctx: ContextProps; input: TAddIntegration; session?: OAuthSessionResource }) => Promise<{ redirectAfter: string }>
>> = {
    [AppCategory.ACCOUNTING]: ({ ctx, input, session }) => addAccounting({ ctx, input, session }),
    [AppCategory.STORAGE]: ({ ctx, input, session }) => addStorage({ ctx, input, session }),
}