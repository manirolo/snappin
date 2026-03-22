import { z } from "zod";

export const ZGetAccounts = z.object({
    integrationId: z.string(),
});
export type TGetAccounts = z.infer<typeof ZGetAccounts>;