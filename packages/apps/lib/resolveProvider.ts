import { AppCategory, AppSlug, StorageAppSlug } from "@snappin/shared/apps/app.schema";
import { StorageApps, AccountingApps } from "../appRegistry.interface";
import { AccountingAppsStore, StorageAppsStore } from "../appRegistry";
import { HttpError } from "@snappin/lib/http-error";
import { StatusCodes } from "http-status-codes";

export type AnyStorageProvider = StorageApps<StorageAppSlug>
export type AnyAccountingProvider = AccountingApps
export type AnyMessagingProvider = never
export type AnyProvider = AnyStorageProvider | AnyAccountingProvider | AnyMessagingProvider

export function resolveProvider(category: AppCategory, slug: AppSlug): AnyProvider {
    const stores: Partial<Record<AppCategory, Record<string, AnyProvider>>> = {
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
