import { AppSlug } from "@snappin/shared/apps/app.schema";
import { gmailMetadata } from "./gmail/gmail.metadata";
import { outlookMetadata } from "./outlook/outlook.metadata";
import { imapMetadata } from "./imap/imap.metadata";
import { whatsappMetadata } from "./whatsapp/whatsapp.metadata";
import { googleDriveMetadata } from "./googleDrive/googleDrive.metadata";
import { xeroMetadata } from "./xero/xero.metadata";

export const appMetadata  = {
    [AppSlug.OUTLOOK]: outlookMetadata,
    [AppSlug.GMAIL]: gmailMetadata,
    [AppSlug.IMAP]: imapMetadata,
    [AppSlug.WHATSAPP]: whatsappMetadata,
    [AppSlug.GOOGLE_DRIVE]: googleDriveMetadata,
    [AppSlug.XERO]: xeroMetadata,
} as const;