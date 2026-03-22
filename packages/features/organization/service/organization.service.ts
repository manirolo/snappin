import { OrganizationResource } from "@snappin/shared/organization/organization.schema";
import { organizationRepository } from "../repository/organization.repository";
import { clerk } from "@snappin/features/trpc/config/clerk";

export class OrganizationService {
    protected readonly _orgRepo = organizationRepository

    async createOrganization(data: OrganizationResource) {
        if (!data.clerkOrgId) return

        console.log("Received org create request", data.clerkOrgId)

        try {
            try {
               const clerkOrg = await clerk.organizations.getOrganization({ organizationId: data.clerkOrgId })
               if(!clerkOrg) throw new Error("Organization does not exist in clerk records")
            } catch {
                throw new Error("Organization does not exist in clerk records")
            }

            const existingOrg = await this._orgRepo.get(data.clerkOrgId)
            if (existingOrg) throw new Error("Organization already exists")

            await this._orgRepo.create(data)

            console.log("Completed org create request", data.clerkOrgId)
        } catch (err) {
            console.error("createOrganization failed:", err) 
            throw err
        }
    }
}

export const orgService = new OrganizationService()