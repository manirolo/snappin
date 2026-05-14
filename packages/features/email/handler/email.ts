import { GenericWebhookEvent } from "../../webhook/types";
import { mailReceived } from "../trigger/mail.received.task";

export class EmailHandler {

    /**
     * Handle incoming mail webhook and trigger extraction pipeline
     * @param event 
     */
    async read(event: GenericWebhookEvent): Promise<void> {

        interface ResendMailPayload {
            email_id: string;
            message_id: string;
            from: string;
            subject: string;
        }

        const parsed = event.payload as ResendMailPayload;

        await mailReceived.trigger({
            emailId: parsed.email_id,
            messageId: parsed.message_id,
            from: parsed.from,
            subject: parsed.subject,
        });
    }
}