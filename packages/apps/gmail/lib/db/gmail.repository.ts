import { AppSlug } from "@snappin/shared/apps/app.enum";
import { db } from "@snappin/db/index";
import { GetIntegrationProps } from "../../../appRegistry.interface";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";

export class GmailRepository {
    async getIntegrationData({ integrationKey }: GetIntegrationProps): Promise<IntegrationResource | null> {
        return db.integration.findOne({
            appSlug: AppSlug.GMAIL,
            identifierEmail: integrationKey,
        });
    }
}