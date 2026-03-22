import { AppCategory, AppDefinition, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";
import { StorageApps } from "../appRegistry.interface";
import { GoogleDriveConfigData } from "./googleDrive.types";
import { googleDriveMetadata } from "./googleDrive.metadata";
import { googleDriveConfigData } from "./googleDrive.config";
import { generateSessionUrl } from "./lib/generateSessionUrl";
import { buildIntegrationData } from "./lib/buildIntegrationData";
import { exchangeCodeForTokens } from "./lib/exchangeCodeForToken";
import { getUserEmailAddress } from "./lib/getUserEmailAddress";
import { getAccessToken } from "./lib/getAccessToken";
import { revokeToken } from "./lib/revokeToken";
import { findOrCreateFolder } from "./lib/findOrCreateFolder";
import { resolveIdentity } from "./lib/resolveIdentity";
import { createFile } from "./lib/createFile";

export const GoogleDriveAppServices = {
    generateSessionUrl,
    buildIntegrationData,
    exchangeCodeForTokens,
    getUserEmailAddress,
    getAccessToken,
    revokeToken,
    findOrCreateFolder,
    createFile,
    resolveIdentity,
} as StorageApps<AppSlug.GOOGLE_DRIVE>

export const googleDriveApp: AppDefinition<GoogleDriveConfigData> = {
    slug: AppSlug.GOOGLE_DRIVE,
    role: [AppRole.STORAGE],
    category: AppCategory.STORAGE,
    type: AppType.DESTINATION,
    metadata: googleDriveMetadata,
    config: googleDriveConfigData,
}
