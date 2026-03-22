import z from "zod";
import { IntegrationResource, ZIntegration } from "@snappin/shared/integration/integration.schema";

export const ZUpdateIntegration = z.object({
    integrationId: z.string(),
    data: ZIntegration
})

export type TUpdateIntegration = {
    integrationId: string
    data: IntegrationResource
}