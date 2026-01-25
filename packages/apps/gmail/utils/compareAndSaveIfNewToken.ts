import { connectDB } from "@snappin/db/connect";
import { db } from "@snappin/db/index";
import { IntegrationResource } from "@snappin/db/model/integration.model"

type CompareAndSaveIfNewTokenProps = {
    integration: IntegrationResource,
    accessTokenFromFn: string,
    accessTokenExpiresAtFromFn?: Date | null
}

export const compareAndSaveIfNewToken = async ({ integration, accessTokenFromFn, accessTokenExpiresAtFromFn, }: CompareAndSaveIfNewTokenProps): Promise<void> => {

    // No token returned → nothing to do
    if (!accessTokenFromFn) return;

    const isSameToken = integration.accessToken === accessTokenFromFn;

    // If token didn't change, skip DB write
    if (isSameToken) return;

    const update: Partial<IntegrationResource> = {
        accessToken: accessTokenFromFn,
    };

    if (accessTokenExpiresAtFromFn) {
        update.accessTokenExpiresAt = accessTokenExpiresAtFromFn;
    }
    await connectDB()
    await db.integration.updateOne({ _id: integration._id }, { $set: update });
};
