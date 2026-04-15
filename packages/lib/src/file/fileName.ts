import { InvoiceFileFormatPreference, FileFormatComponent } from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema"
import { formatDate } from "@snappin/lib/date/formateDate"
import { formatMinorAmount } from "../amount/formatMinorAmount"

export type CreateFileNameProps = {
    format: InvoiceFileFormatPreference
    date?: string | null
    vendor?: string | null
    invoiceId?: string | null
    amount?: number | null
    currency?: string | null
}

export function createFileName({
    format,
    date,
    vendor,
    invoiceId,
    amount,
    currency,
}: Omit<CreateFileNameProps, "extension">): string {
    const { components, separator, dateFormat, uppercase } = format

    const resolveComponent = (component: FileFormatComponent): string | null => {
        switch (component) {
            case "date":
                return date ? formatDate(dateFormat, date) : null
            case "vendor":
                return vendor ?? null
            case "invoiceId":
                return invoiceId ?? null
            case "amount":
                return amount != null ? String(formatMinorAmount(amount)) : null
            case "currency":
                return currency ?? null
        }
    }

    const parts = components
        .map(resolveComponent)
        .filter((part): part is string => part !== null && part.trim() !== "")
        .map((part) =>
            part
                .trim()
                .replace(/[.,/#!$%^&*;:{}=\-_`~()@+?><[\]+"|]/g, "")
                .replace(/\s+/g, separator)
                .trim())
        .filter((part) => part !== "")

    const name = parts.join(separator)
    return uppercase ? name.toUpperCase() : name
}

export const sanitizeFileName = (name: string): string => {
    // Only allow: alphanumeric, underscores, hyphens, dots, spaces
    return name.replace(/[^a-zA-Z0-9_\-. ]/g, '_');
};