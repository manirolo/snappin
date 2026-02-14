import { ExpenseDocument } from "@snappin/infra/aws/textract";
import { groupTextractFields, normalizeLineItems } from "./textract.normalizer";

export type NormalizedField = {
    type: string;
    value: string | null;
    label?: string | null;
    currency?: string;
};
export type NormalizedLineItem = {
    item: string | null;
    quantity: string | null;
    unitPrice: string | null;
    totalPrice: string | null;
    currency?: string;
};
export type NormalizedInvoiceData = {
    vendor: NormalizedField[];
    receiver: NormalizedField[];
    invoice: NormalizedField[];
    lineItems: NormalizedLineItem[] | null;
};
export interface Normalizer<TInput, TOutput> {
    normalize(input: TInput): TOutput;
}

export class TextractNormalizer implements Normalizer<ExpenseDocument, NormalizedInvoiceData> {

    normalize(doc: ExpenseDocument): NormalizedInvoiceData {

        const { vendor, receiver, invoice } = groupTextractFields(doc.SummaryFields);

        const lineItems = normalizeLineItems(doc.LineItemGroups);

        return {
            vendor,
            receiver,
            invoice,
            lineItems,
        };
    }
}
