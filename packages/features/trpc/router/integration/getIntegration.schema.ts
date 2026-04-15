import z from "zod";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";
import { ZAppSlug } from "@snappin/shared/apps/app.schema";

export const ZGetIntegration = z.object({
    appSlug: ZAppSlug.optional(),
    integrationId: z.string().optional(),
})

export type TGetIntegration = z.infer<typeof ZGetIntegration>

export type GetIntegrationResponse = IntegrationResource