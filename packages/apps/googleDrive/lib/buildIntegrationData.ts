import { AppSlug } from "@snappin/shared/apps/app.schema"
import { BuildStorageIntegrationData, BuildStorageIntegrationDataResponse } from "../../appRegistry.interface"
import { GoogleDriveAppServices } from "../googleDrive.app"
import { DEFAULT_ORGANIZATION_STRATEGY } from "@snappin/lib/storage/resolveStoragePaths"

export async function buildIntegrationData({
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
}: BuildStorageIntegrationData): Promise<BuildStorageIntegrationDataResponse<AppSlug.GOOGLE_DRIVE>> {

    // findOrCreateFolder is idempotent but still a side effect —
    // only runs after duplicate check passes in the handler
    const { folderId } = await GoogleDriveAppServices.findOrCreateFolder({
        accessToken,
        folderName: "Snappin",
    })

    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        config: {
            storageFolderId: folderId,
            organization: {
                strategy: DEFAULT_ORGANIZATION_STRATEGY,
            },
        },
    }
}