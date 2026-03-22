import { OrganizationResource } from "@snappin/shared/organization/organization.schema";
import { ZOrganizationPreference } from "@snappin/shared/organization/organization.schema";
import { ContextProps } from "../../_trpc";
import { z } from "zod";
import { clerk } from "../../config/clerk";
import { assertResourceAccess } from "../../lib/assertResourceAccess";

export const ZUpdateOrganizationInput = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    preference: ZOrganizationPreference.optional(),
});

export type UpdateOrganizationInput = z.infer<typeof ZUpdateOrganizationInput>;

export type UpdateOrganization = {
    ctx: ContextProps;
    input: UpdateOrganizationInput;
};

export async function updateOrganization({ ctx, input }: UpdateOrganization): Promise<OrganizationResource | null> {
    const { name, slug, preference } = input;

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    
    const clerkUpdatePayload: Record<string, unknown> = {};
    if (name !== undefined) clerkUpdatePayload.name = name;
    if (slug !== undefined) clerkUpdatePayload.slug = slug;

    if(!ctx.orgId) return null

    if (Object.keys(clerkUpdatePayload).length > 0) {
        await clerk.organizations.updateOrganization(ctx.orgId, clerkUpdatePayload);
    }

    const dbUpdatePayload: Record<string, unknown> = {};
    if (name !== undefined) dbUpdatePayload.name = name;
    if (slug !== undefined) dbUpdatePayload.slug = slug;

    // Flatten preference fields to avoid overwriting unrelated nested fields
    if (preference?.invoiceFileNameFormat !== undefined) {
        dbUpdatePayload["preference.invoiceFileNameFormat"] = preference.invoiceFileNameFormat;
    }

    if (Object.keys(dbUpdatePayload).length === 0) return null;

    return await ctx.db.organization.findOneAndUpdate(
        { clerkOrgId: ctx.orgId },
        dbUpdatePayload,
        { new: true }
    );
}