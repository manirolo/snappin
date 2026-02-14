import { textract, AnalyzeExpenseCommand, ExpenseDocument } from "@snappin/infra/aws/textract";
import { OCREngine, OCRInput } from "./ocr.service";

export class AwsTextractEngine implements OCREngine<ExpenseDocument> {
    private readonly client = textract;

    async extract(input: OCRInput): Promise<ExpenseDocument> {
        const response = await this.client.send(
            new AnalyzeExpenseCommand({
                Document: {
                    Bytes: input.buffer,
                },
            })
        );

        const expenseDocument = response.ExpenseDocuments?.[0];

        if (!expenseDocument) {
            throw new Error("Textract returned no ExpenseDocument");
        }

        return expenseDocument;
    }
}
