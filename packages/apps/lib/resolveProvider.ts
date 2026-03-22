import { AppCategory, AppSlug, EmailAppSlug, StorageAppSlug } from "@snappin/shared/apps/app.schema";
import { EmailApps, StorageApps, AccountingApps } from "../appRegistry.interface";
import { AccountingAppsStore, EmailAppsStore, StorageAppsStore } from "../appRegistry";
import { HttpError } from "@snappin/lib/http-error";
import { StatusCodes } from "http-status-codes";

export type AnyEmailProvider = EmailApps<EmailAppSlug>
export type AnyStorageProvider = StorageApps<StorageAppSlug>
export type AnyAccountingProvider = AccountingApps
export type AnyMessagingProvider = unknown
export type AnyProvider = AnyEmailProvider | AnyStorageProvider | AnyAccountingProvider | AnyMessagingProvider

// export function resolveProvider(category: AppCategory.EMAIL, slug: EmailAppSlug): AnyEmailProvider
// export function resolveProvider(category: AppCategory.STORAGE, slug: StorageAppSlug): AnyStorageProvider
export function resolveProvider(category: AppCategory, slug: AppSlug): AnyProvider {
    const stores: Partial<Record<AppCategory, Record<string, AnyProvider>>> = {
        [AppCategory.EMAIL]: EmailAppsStore as Record<string, AnyEmailProvider>,
        [AppCategory.STORAGE]: StorageAppsStore as Record<string, AnyStorageProvider>,
        [AppCategory.ACCOUNTING]: AccountingAppsStore as Record<string, AnyAccountingProvider>,
    }

    const store = stores[category]

    if (!store) {
        throw new HttpError({
            statusCode: StatusCodes.NOT_IMPLEMENTED,
            message: `App category '${category}' is not supported`,
        })
    }

    const provider = store[slug]
    if (!provider) {
        throw new HttpError({
            statusCode: StatusCodes.BAD_REQUEST,
            message: `App '${slug}' is not registered under category '${category}'`,
        })
    }

    return provider
}
