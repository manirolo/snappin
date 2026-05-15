import { AppSlug } from "@snappin/shared/apps/app.schema";
import { gmailMetadata } from "./gmail/gmail.metadata";
import { outlookMetadata } from "./outlook/outlook.metadata";
import { imapMetadata } from "./imap/imap.metadata";
import { whatsappMetadata } from "./whatsapp/whatsapp.metadata";
import { googleDriveMetadata } from "./googleDrive/googleDrive.metadata";
import { xeroMetadata } from "./xero/xero.metadata";
// import { msSharedAccountMetadata } from "./msShared/msSharedAccount.metadata";
// import { telegramMetadata } from "./telegram/telegram.metadata";

export const appMetadata  = {
    [AppSlug.GMAIL]: gmailMetadata,
    [AppSlug.OUTLOOK]: outlookMetadata,
    // [AppSlug.MS_SHARED_ACCOUNT]: msSharedAccountMetadata,
    [AppSlug.IMAP]: imapMetadata,
    [AppSlug.WHATSAPP]: whatsappMetadata,
    [AppSlug.GOOGLE_DRIVE]: googleDriveMetadata,
    [AppSlug.XERO]: xeroMetadata,
} as const;