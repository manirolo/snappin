import { AccountingAppSlug, AppSlug, StorageAppSlug } from "@snappin/shared/apps/app.schema";
import { AccountingApps, StorageApps } from "./appRegistry.interface";
import { GoogleDriveAppServices } from "./googleDrive/googleDrive.app";
import { googleDriveApp } from "./googleDrive/googleDrive.app";
import { xeroApp, XeroAppServices } from "./xero/xero.app";

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
  [AppSlug.GOOGLE_DRIVE]: googleDriveApp,
  [AppSlug.XERO]: xeroApp
}
