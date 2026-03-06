import z from "zod";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";

export const ZGetIntegration = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
})

export type TGetIntegration = z.infer<typeof ZGetIntegration>

export type GetIntegrationResponse = IntegrationResource