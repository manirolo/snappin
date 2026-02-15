import { IntegrationResource } from "@snappin/shared/integration/integration.schema";
import { GetIntegrationProps } from "../../../appRegistry.interface";
import { db } from "@snappin/db/index";
import { AppSlug } from "@snappin/shared/apps/app.enum";

export class OutlookRepository {
    getIntegrationData({ integrationKey }: GetIntegrationProps): Promise<IntegrationResource | null> {
        return db.integration.findOne({
            appSlug: AppSlug.OUTLOOK,
            "config.subscriptionId": integrationKey,
        });
    }
}