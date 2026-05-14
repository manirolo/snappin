import { AppSlug } from "@snappin/shared/apps/app.schema";
import { whatsappMetadata } from "./whatsapp/whatsapp.metadata";
import { googleDriveMetadata } from "./googleDrive/googleDrive.metadata";
import { xeroMetadata } from "./xero/xero.metadata";

export const appMetadata  = {
    [AppSlug.WHATSAPP]: whatsappMetadata,
    [AppSlug.GOOGLE_DRIVE]: googleDriveMetadata,
    [AppSlug.XERO]: xeroMetadata,
} as const;