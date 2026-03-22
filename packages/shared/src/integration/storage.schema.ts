export enum StorageOrganizationStrategy {
    YEAR = "year",                    
    VENDOR = "vendor",                
    VENDOR_YEAR = "vendor_year",      
    YEAR_VENDOR = "year_vendor",      
    ROOT = "root",                    
}

export type StorageOrganizationConfig = {
    strategy: StorageOrganizationStrategy
}

export type GoogleDriveConfig = {
    storageFolderId: string | null
    organization: StorageOrganizationConfig
}