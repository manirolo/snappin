import { AppSlug } from "@snappin/shared/apps/app.enum";
import { EmailApps } from "./appRegistry.interface";
import { GmailAppServices } from "./gmail/gmail.app";

export const EmailAppsStore: Record<AppSlug, EmailApps> = {
    [AppSlug.GMAIL]: GmailAppServices as EmailApps
}