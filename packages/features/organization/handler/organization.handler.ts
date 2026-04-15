import { OrganizationJSON } from "@clerk/backend";
import { GenericWebhookEvent } from "../../webhook/types";
import { orgService } from "../service/organization.service";


export class OrganizationHandler {
    private readonly _orgService = orgService

    async create(event: GenericWebhookEvent): Promise<void> {
        const org = event.payload as OrganizationJSON;
        await this._orgService.createOrganization({
            clerkOrgId: org.id,
            name: org.name,
            slug: org.slug,
            createdBy: org.created_by,
        });
    }
}