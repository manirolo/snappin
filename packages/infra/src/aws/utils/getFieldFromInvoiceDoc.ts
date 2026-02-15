import { ExpenseField } from "@aws-sdk/client-textract";

export function getFieldFromInvoiceDoc(summaryFields: ExpenseField[], type: string): string | null {
    const field = summaryFields.find(
        (f) => f.Type?.Text === type
    );

    return field?.ValueDetection?.Text ?? null;
}