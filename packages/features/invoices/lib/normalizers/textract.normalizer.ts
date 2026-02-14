import { ExpenseDocument, LineItemGroup } from "@snappin/infra/aws/textract";
import { NormalizedField, NormalizedLineItem } from "./normalizer.service";

export type NormalizedInvoiceData = {
    vendor: NormalizedField[];
    receiver: NormalizedField[];
    invoice: NormalizedField[];
    lineItems: NormalizedLineItem[] | null;
};

/**
 * Normalizes Textract output into domain-friendly structures.
 *
 * Pure function:
 * - deterministic
 * - no side effects
 * - reusable across pipelines
 */
export function normalizeTextractDocument(input: { summaryFields?: ExpenseDocument["SummaryFields"]; lineItemGroups?: LineItemGroup[]; }): NormalizedInvoiceData {
    const { vendor, receiver, invoice } = groupTextractFields(
        input.summaryFields
    );

    const lineItems = normalizeLineItems(input.lineItemGroups);

    return {
        vendor,
        receiver,
        invoice,
        lineItems,
    };
}

export function normalizeLineItems(
    groups?: LineItemGroup[]
): NormalizedLineItem[] | null {
    if (!groups?.length) return null;

    const items: NormalizedLineItem[] = [];

    for (const group of groups) {
        for (const line of group.LineItems ?? []) {
            const item: NormalizedLineItem = {
                item: null,
                quantity: null,
                unitPrice: null,
                totalPrice: null,
            };

            for (const field of line.LineItemExpenseFields ?? []) {
                switch (field.Type?.Text) {
                    case "ITEM":
                    case "ITEM_NAME":
                        item.item = field.ValueDetection?.Text ?? null;
                        break;
                    case "QUANTITY":
                        item.quantity = field.ValueDetection?.Text ?? null;
                        break;
                    case "UNIT_PRICE":
                        item.unitPrice = field.ValueDetection?.Text ?? null;
                        item.currency = field.Currency?.Code;
                        break;
                    case "PRICE":
                    case "TOTAL_PRICE":
                        item.totalPrice = field.ValueDetection?.Text ?? null;
                        item.currency = field.Currency?.Code;
                        break;
                }
            }

            if (item.item || item.totalPrice) {
                items.push(item);
            }
        }
    }

    return items.length ? items : null;
}

export function groupTextractFields(
    summaryFields?: ExpenseDocument["SummaryFields"]
) {
    const vendor: NormalizedField[] = [];
    const receiver: NormalizedField[] = [];
    const invoice: NormalizedField[] = [];

    for (const item of summaryFields ?? []) {
        const value = item.ValueDetection?.Text;
        if (!value) continue;

        const field: NormalizedField = {
            type: item.Type?.Text ?? "UNKNOWN",
            value,
            label: item.LabelDetection?.Text ?? null,
            currency: item.Currency?.Code,
        };

        const group = item.GroupProperties?.[0]?.Types?.[0];

        if (group === "VENDOR") vendor.push(field);
        else if (group === "RECEIVER") receiver.push(field);
        else invoice.push(field);
    }

    return { vendor, receiver, invoice };
}
