import {
    LineItem,
    Contact,
    LineAmountTypes,
} from "xero-node";
import {
    CreateBillProps,
    LineAmountType,
} from "../../appRegistry.interface";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";

export function mapLineAmountType(type?: LineAmountType | null): LineAmountTypes {
    switch (type) {
        case LineAmountType.INCLUSIVE: return LineAmountTypes.Inclusive;
        case LineAmountType.NONE: return LineAmountTypes.NoTax;
        case LineAmountType.EXCLUSIVE:
        default: return LineAmountTypes.Exclusive;
    }
}

export function mapInvoiceToBillProps(
    invoice: InvoiceResource,
    integration: { accessToken: string; tenantId: string },
    options?: {
        lineAmountType?: LineAmountType;
        accountCode?: string;       // selected by user from getAccounts dropdown
        attachment?: CreateBillProps["attachment"];
    }
): CreateBillProps {
    return {
        accessToken: integration.accessToken,
        tenantId: integration.tenantId,

        // Contact
        contactName: invoice.vendor?.name ?? "Unknown Vendor",
        contactEmail: invoice.vendor?.email ?? null,

        // Invoice details
        invoiceNumber: invoice.invoiceId ?? null,
        invoiceDate: invoice.invoiceDate ?? null,
        dueDate: invoice.dueDate ?? null,
        currency: invoice.totals?.currency ?? null,
        reference: invoice.description ?? invoice.invoiceId ?? null,

        lineAmountType: options?.lineAmountType ?? LineAmountType.EXCLUSIVE,

        // Map Snappin line items → BillLineItem
        lineItems: invoice.lineItems?.length
            ? invoice.lineItems.map(item => ({
                description: item.description ?? "Item",
                quantity: item.quantity ?? 1,
                unitAmount: item.unitPrice != null
                    ? item.unitPrice / 100   // convert minor units → major
                    : (invoice.totals?.total ?? 0) / 100,
                accountCode: options?.accountCode ?? null,
                taxType: null,
                lineAmount: item.total != null
                    ? item.total / 100
                    : null,
            }))
            // Fallback — single line item from totals if no line items
            : [{
                description: invoice.description ?? "",
                quantity: 1,
                unitAmount: (invoice.totals?.total ?? 0) / 100,
                accountCode: options?.accountCode ?? null,
                taxType: null,
                lineAmount: null,
            }],

        attachment: options?.attachment ?? null,
    };
}

export function mapContact(contactName: string, contactEmail?: string | null): Contact {
    return {
        name: contactName,
        ...(contactEmail ? { emailAddress: contactEmail } : {}),
    };
}

export function mapLineItems(
    lineItems: CreateBillProps["lineItems"]
): LineItem[] {
    return lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitAmount: item.unitAmount,
        ...(item.accountCode != null && item.accountCode !== ""
            ? { accountCode: item.accountCode }
            : {}),
        ...(item.taxType ? { taxType: item.taxType } : {}),
        ...(item.lineAmount ? { lineAmount: item.lineAmount } : {}),
    }));
}