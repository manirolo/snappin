import { AppSlug } from "@snappin/shared/apps/app.enum";
import { EmailApps } from "./appRegistry.interface";
import { GmailAppServices } from "./gmail/gmail.app";
import { OutlookAppServices } from "./outlook/outlook.app";

export const EmailAppsStore: {
  [K in AppSlug]: EmailApps<K>
} = {
  [AppSlug.GMAIL]: GmailAppServices,
  [AppSlug.OUTLOOK]: OutlookAppServices,
};
