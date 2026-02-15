import { ZInvoiceDocument } from "@snappin/shared/invoice/invoice.schema";
import { ZVendor } from "@snappin/shared/invoice/vendor.schema";
import { z } from "zod";
import { toAISchema } from "../../utils/omitFieldsForAI";
import { ResponseSchema, SchemaType } from "@snappin/infra/google/ai";

export const ZInvoiceDocumentAI = toAISchema(ZInvoiceDocument, {
    vendorId: true,
    manualReviewRequired: true,
});

export const ZVendorAI = toAISchema(ZVendor, {
    _id: true,
    userId: true,
    orgId: true,
    createdAt: true,
    updatedAt: true
})

export const ZGeminiInvoiceResponse = z.object({
    vendor: ZVendorAI.nullable(),
    invoice: ZInvoiceDocument,
});

export type TGeminiInvoiceResponse = z.infer<typeof ZGeminiInvoiceResponse>

const INVOICE_TYPES = ["invoice", "receipt", 'credit_note'];
const PAYMENT_STATUSES = ["paid", "unpaid", "partial", "refunded"];
const INVOICE_SUBSCRIPTION_FREQUENCY = ["day", "weekly", "monthly", "yearly"]

export const invoiceResponseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    required: ["vendor", "invoice"],
    properties: {
        vendor: {
            type: SchemaType.OBJECT,
            nullable: true,
            properties: {
                name: { type: SchemaType.STRING, nullable: true },
                aliasName: { type: SchemaType.STRING, nullable: true, description: "Simple one word alias name for vendor i.e: Spotify India LLC -> Spotify" },
                businessRegistrationId: { type: SchemaType.STRING, nullable: true },
                emailId: { type: SchemaType.STRING, nullable: true },
                phone: { type: SchemaType.STRING, nullable: true },
                website: { type: SchemaType.STRING, nullable: true },
                taxId: { type: SchemaType.STRING, nullable: true },
                taxType: { type: SchemaType.STRING, nullable: true },
                address: { type: SchemaType.STRING, nullable: true },
                state: { type: SchemaType.STRING, nullable: true },
                country: { type: SchemaType.STRING, nullable: true },
                zipCode: { type: SchemaType.STRING, nullable: true }
            }
        },

        invoice: {
            type: SchemaType.OBJECT,
            properties: {
                type: { type: SchemaType.STRING, nullable: true, enum: INVOICE_TYPES, format: "enum" },
                number: { type: SchemaType.STRING, nullable: true },
                description: { type: SchemaType.STRING, nullable: true },

                issuedAt: { type: SchemaType.STRING, nullable: true },
                dueDate: { type: SchemaType.STRING, nullable: true },

                subTotal: { type: SchemaType.NUMBER, nullable: true },
                total: { type: SchemaType.NUMBER, nullable: true },
                paidAmount: { type: SchemaType.NUMBER, nullable: true },
                balanceDue: { type: SchemaType.NUMBER, nullable: true },
                shippingFee: { type: SchemaType.NUMBER, nullable: true },

                currency: { type: SchemaType.STRING, nullable: true },
                manualReviewRequired: { type: SchemaType.BOOLEAN, nullable: true },

                payment: {
                    type: SchemaType.OBJECT,
                    nullable: true,
                    properties: {
                        status: { type: SchemaType.STRING, nullable: true, enum: PAYMENT_STATUSES, format: "enum" },
                        paymentTerms: { type: SchemaType.STRING, nullable: true },
                        paymentMethod: { type: SchemaType.STRING, nullable: true },
                        paymentDate: { type: SchemaType.STRING, nullable: true },
                        paymentDueDate: { type: SchemaType.STRING, nullable: true },
                        transactionId: { type: SchemaType.STRING, nullable: true }
                    }
                },

                subscription: {
                    type: SchemaType.OBJECT,
                    nullable: true,
                    properties: {
                        frequency: { type: SchemaType.STRING, nullable: true, enum: INVOICE_SUBSCRIPTION_FREQUENCY, format: "enum" },
                        isRecurring: { type: SchemaType.BOOLEAN, nullable: true },
                        nextBillingDate: { type: SchemaType.STRING, nullable: true },
                    }
                },

                lineItems: {
                    type: SchemaType.ARRAY,
                    nullable: true,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            item: { type: SchemaType.STRING, nullable: true },
                            description: { type: SchemaType.STRING, nullable: true },
                            tax: {
                                type: SchemaType.OBJECT,
                                nullable: true,
                                properties: {
                                    taxType: { type: SchemaType.STRING, nullable: true },
                                    taxRate: { type: SchemaType.NUMBER, nullable: true },
                                    taxAmount: { type: SchemaType.NUMBER, nullable: true }
                                }
                            },
                            quantity: { type: SchemaType.NUMBER, nullable: true },
                            unitPrice: { type: SchemaType.NUMBER, nullable: true },
                            totalPrice: { type: SchemaType.NUMBER, nullable: true }
                        }
                    }
                }
            }
        }
    }
};

