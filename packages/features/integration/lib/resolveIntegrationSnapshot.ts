import { IntegrationSnapshot } from "@snappin/shared/integration/integration.schema";

export async function resolveIntegrationSnapshot(
    integrationId: string | null | undefined
): Promise<IntegrationSnapshot | null> {
    if (!integrationId) return null;

    const { db } = await import("@snappin/db/index");
    const integration = await db.integration.findById(integrationId).lean();

    if (!integration) return null;

    const phone = integration.metadata && "phone" in integration.metadata
        ? (integration.metadata as { phone?: string | null }).phone
        : null;

    return {
        id: integration._id?.toString() ?? null,
        appSlug: integration.appSlug ?? null,
        identifier: phone ?? integration.identifierEmail ?? null,
    };
}