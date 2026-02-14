import { AppSlug } from "@snappin/shared/apps/app.enum";
import { gmailConfig } from "./gmail/config/gmail.config";
import { outlookConfig } from "./outlook/outlook.config";

export const appMetadata = {
    [AppSlug.GMAIL]: gmailConfig,
    [AppSlug.OUTLOOK]: outlookConfig
}