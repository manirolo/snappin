import { VendorResource } from "@snappin/shared/vendor/vendor.schema";

export function getVendorMatchFilter({
    userId,
    vendor,
    orgId,
}: {
    userId: string
    vendor?: VendorResource | null
    orgId?: string | null
}) {
    const base = { userId, ...(orgId ? { orgId } : {}) }

    if (vendor?.taxId) return { ...base, taxId: vendor.taxId.trim() }
    if (vendor?.businessRegistrationId) return { ...base, businessRegistrationId: vendor.businessRegistrationId.trim() }
    if (vendor?.name) return { ...base, name: vendor.name.trim() }

    return null
}