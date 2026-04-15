import { Integration } from "./model/integration.model";
import { InvoiceExtractionRequestModel } from "./model/invoiceExtractionRequest.model";
import { Invoice } from "./model/invoice.model";
import { OAuthSession } from "./model/oauthSession.model";
import { Vendor } from "./model/vendor.model";
import { Scan } from "./model/scan.model";
import { ScanChunk } from "./model/scanChunk.model";
import { User } from "./model/user.model";
import { Organization } from "./model/organization.model";
import { ScanMessage } from "./model/scanMessage.model";
import { Plan } from "./model/plan.model";
import { Subscription } from "./model/subscription.model";

export const db = {
    oauthSession: OAuthSession,
    integration: Integration,
    invoiceExtractionRequest: InvoiceExtractionRequestModel,
    invoice: Invoice,
    scan: Scan,
    scanChunk: ScanChunk,
    scanMessage: ScanMessage,
    vendor: Vendor,
    user: User,
    organization: Organization,
    plan: Plan,
    subscription: Subscription,
}