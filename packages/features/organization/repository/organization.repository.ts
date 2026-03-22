import { OrganizationResource } from "@snappin/shared/organization/organization.schema"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"

connectDB()

export class OrganizationRepository {
    async create(data: OrganizationResource) {
        await db.organization.create(data)
    }

    async update(clerkOrgId: string, data: Partial<OrganizationResource>) {
        await db.organization.findOneAndUpdate({ clerkOrgId: clerkOrgId }, data, { new: true })
    }

    async get(clerkOrgId: string){
        return await db.organization.findOne({ clerkOrgId: clerkOrgId })
    }

    async delete(clerkOrgId: string){
        await db.organization.findOneAndDelete({clerkOrgId: clerkOrgId })
    }
}

export const organizationRepository = new OrganizationRepository()