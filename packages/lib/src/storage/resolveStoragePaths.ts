import { StorageOrganizationStrategy } from "@snappin/shared/integration/storage.schema"

export type OrganizationStrategyOption = {
    value: StorageOrganizationStrategy
    label: string
    description: string
}

export const ORGANIZATION_STRATEGY_OPTIONS: OrganizationStrategyOption[] = [
    {
        value: StorageOrganizationStrategy.YEAR,
        label: "Year",
        description: "Documents organized by year  →  Snappin / 2025 / invoice.pdf",
    },
    {
        value: StorageOrganizationStrategy.VENDOR,
        label: "Vendor",
        description: "Documents organized by vendor  →  Snappin / Amazon / invoice.pdf",
    },
    {
        value: StorageOrganizationStrategy.VENDOR_YEAR,
        label: "Vendor › Year",
        description: "Vendor first, then year  →  Snappin / Amazon / 2025 / invoice.pdf",
    },
    {
        value: StorageOrganizationStrategy.YEAR_VENDOR,
        label: "Year › Vendor",
        description: "Year first, then vendor  →  Snappin / 2025 / Amazon / invoice.pdf",
    },
    {
        value: StorageOrganizationStrategy.ROOT,
        label: "No organization",
        description: "All documents in root  →  Snappin / invoice.pdf",
    },
]

export const DEFAULT_ORGANIZATION_STRATEGY = StorageOrganizationStrategy.YEAR

// ── Path resolver ──────────────────────────────────────────────────────────────

export type ResolveStoragePathProps = {
    strategy: StorageOrganizationStrategy
    year: string        // e.g. "2025"
    vendor?: string     // e.g. "Amazon" — optional, falls back to root if missing
    fileName: string    // e.g. "invoice.pdf"
}

export type ResolvedStoragePath = {
    folders: string[]   // ordered folder segments to create/traverse
    fileName: string
}

export function resolveStoragePath({
    strategy,
    year,
    vendor,
    fileName,
}: ResolveStoragePathProps): ResolvedStoragePath {
    const v = vendor ?? "Unknown"

    const foldersByStrategy: Record<StorageOrganizationStrategy, string[]> = {
        [StorageOrganizationStrategy.YEAR]:        [year],
        [StorageOrganizationStrategy.VENDOR]:      [v],
        [StorageOrganizationStrategy.VENDOR_YEAR]: [v, year],
        [StorageOrganizationStrategy.YEAR_VENDOR]: [year, v],
        [StorageOrganizationStrategy.ROOT]:        [],
    }

    return {
        folders: foldersByStrategy[strategy] ?? [],
        fileName,
    }
}