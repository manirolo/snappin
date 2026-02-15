import { AnalyzeExpenseCommand, Textract } from "@aws-sdk/client-textract"
import { env } from "@snappin/env"

export type InvoiceExtractedData = {
    invoiceNumber: string | null;
    invoiceDate: string | null;
    supplierName: string | null;
    supplierAddress: string | null;
    totalAmount: string | null;
    taxAmount: string | null;
    currency: string | null;
};

export const textract = new Textract({
    region: env.aws.region,
    credentials: {
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey
    }
})


/**
 * Invoice data extraction
 * 
 * @param buffer - Invoice/receipt/bill document in buffer
 * @returns - returns invoice data
 * 
 * @docs - https://docs.aws.amazon.com/textract/latest/dg/invoices-receipts.html
 */
export const extractInvoiceDocumentData = async (buffer: Buffer) => {
    const command = new AnalyzeExpenseCommand({
        Document: {
            Bytes: buffer
        }
    })

    const response = await textract.send(command)

    const doc = response?.ExpenseDocuments?.[0]

    if (!doc) return null;


    return {
        summaryFields: doc.SummaryFields ?? [],
        lineItemGroups: doc.LineItemGroups ?? [],
    };
}

export * from "@aws-sdk/client-textract"