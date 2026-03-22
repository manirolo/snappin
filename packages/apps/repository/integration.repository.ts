import { connectDB } from "@snappin/db/connect";
import { db } from "@snappin/db/index";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";

connectDB()
class IntegrationRepository {
    async create(data: IntegrationResource){
        return await db.integration.create(data)
    }
    async update(integrationId: string, data: Partial<IntegrationResource>){
        return await db.integration.findOneAndUpdate({ _id: integrationId }, data)
    }
}

export const integrationRepository = new IntegrationRepository();