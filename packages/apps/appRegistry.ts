import { AccountingAppSlug, AppSlug, EmailAppSlug, StorageAppSlug } from "@snappin/shared/apps/app.schema";
import { AccountingApps, EmailApps, StorageApps } from "./appRegistry.interface";
import { gmailApp, GmailAppServices } from "./gmail/gmail.app";
import { outlookApp, OutlookAppServices } from "./outlook/outlook.app";
import { GoogleDriveAppServices } from "./googleDrive/googleDrive.app";
import { googleDriveApp } from "./googleDrive/googleDrive.app";
import { xeroApp, XeroAppServices } from "./xero/xero.app";

export const EmailAppsStore: {
  [K in EmailAppSlug]: EmailApps<K>
} = {
  [AppSlug.GMAIL]: GmailAppServices,
  [AppSlug.OUTLOOK]: OutlookAppServices,
};

export const StorageAppsStore: {
  [K in StorageAppSlug]: StorageApps<K>
} = {
  [AppSlug.GOOGLE_DRIVE]: GoogleDriveAppServices
}

export const AccountingAppsStore: {
  [K in AccountingAppSlug]: AccountingApps
} = {
  [AppSlug.XERO]: XeroAppServices
}

export const AppRegistry = {
  [AppSlug.GMAIL]: gmailApp,
  [AppSlug.OUTLOOK]: outlookApp,
  [AppSlug.GOOGLE_DRIVE]: googleDriveApp,
  [AppSlug.XERO]: xeroApp
}
