import { AppSlug, EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { EmailApps } from "./appRegistry.interface";
import { gmailApp, GmailAppServices } from "./gmail/gmail.app";
import { outlookApp, OutlookAppServices } from "./outlook/outlook.app";

export const EmailAppsStore: {
  [K in EmailAppSlug]: EmailApps<K>
} = {
  [AppSlug.GMAIL]: GmailAppServices,
  [AppSlug.OUTLOOK]: OutlookAppServices,
};

export const AppRegistry = {
  [AppSlug.GMAIL]: gmailApp,
  [AppSlug.OUTLOOK]: outlookApp
}
