import { ZAnalyzeEngine, ZOCREngine, ZExtractionStatus } from "@snappin/shared/invoice/invoice.schema";
import { ZInvoiceSave } from "./invoice.save.schema";
import { schemaTask } from "@trigger.dev/sdk";

export const invoiceSave = schemaTask({
    id: "invoice.save",
    schema: ZInvoiceSave,
    run: async (payload) => {

        const { connectDB } = await import("@snappin/db/connect");
        const { db } = await import("@snappin/db/index");
        const { createInvoice } = await import("../createInvoice");

        connectDB();

        let vendorInDB = await db.vendor.findOneAndUpdate(
            {
                userId: payload.integration.userId,
                emailId: extractEmail(
                    payload.vendor?.emailId ??
                    payload.source?.mail?.from
                )
            },
            {
                $setOnInsert: {
                    ...payload.vendor,
                    userId: payload.integration.userId,
                    orgId: payload.integration.orgId,
                    emailId: extractEmail(
                        payload.vendor?.emailId ??
                        payload.source?.mail?.from
                    )
                }
            },
            {
                upsert: true,
                new: true
            }
        );


        function extractEmail(value?: string | null): string | null {
            if (!value) return null;

            // Match email inside <>
            const match = value.match(/<([^>]+)>/);
            if (match?.[1]) return match[1].trim();

            // Otherwise, check if the whole string is an email
            const emailMatch = value.match(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
            );

            return emailMatch ? emailMatch[0] : null;
        }

        // Create new vendor in db if not available
        if (!vendorInDB && payload.vendor?.name) {
            vendorInDB = await db.vendor.create({
                ...payload.vendor,
                userId: payload.integration.userId,
                orgId: payload.integration.orgId,
                emailId: extractEmail(
                    payload.vendor.emailId ??
                    payload.source.mail?.from
                )
            })
        }

        // create invoice record in db
        await createInvoice({
            userId: payload.integration.userId,
            orgId: payload.integration.orgId,
            invoice: { ...payload.invoice, vendorId: vendorInDB?._id ?? null },
            source: {
                slug: payload.integration.appSlug,
                category: payload.integration.appCategory,
                ...(payload.source.mail && {
                    mail: {
                        ...payload.source.mail,
                        to: payload.integration.identifierEmail,
                    }
                })
            },
            extraction: {
                ocrEngine: ZOCREngine.options[2],
                analyzeEngine: ZAnalyzeEngine.options[0],
                raw: `${payload.extraction?.raw}`,
                status: ZExtractionStatus.options[1],
                error: null
            },
            attachmentId: payload.attachmentId,
            isInvoice: true,
            isRefund: false
        })
    }
})
