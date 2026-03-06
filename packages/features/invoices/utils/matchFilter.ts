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
    const base = { userId, orgId }

    // Priority 1 — tax ID is globally unique per vendor
    if (vendor?.taxId) {
        return { ...base, taxId: vendor.taxId.trim() }
    }

    // Priority 2 — business registration is also unique
    if (vendor?.businessRegistrationId) {
        return { ...base, businessRegistrationId: vendor.businessRegistrationId.trim() }
    }

    // Priority 5 — name + country to reduce false matches (Amazon US ≠ Amazon IN)
    if (vendor?.name && vendor?.country) {
        return {
            ...base,
            name: vendor.name.trim(),
            country: vendor.country.trim(),
        }
    }

    if (vendor?.legalName) {
        return {
            ...base,
            legalName: vendor.legalName.trim(),
        }
    }

    // No reliable identifier — don't upsert, create new instead
    return null
}