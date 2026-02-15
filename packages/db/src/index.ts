import { Integration } from "./model/integration.model";
import { Invoice } from "./model/invoice.model";
import { OAuthSession } from "./model/oauthSession.model";
import { Vendor } from "./model/vendor.model";

export const db = {
    oauthSession: OAuthSession,
    integration: Integration,
    invoice: Invoice,
    vendor: Vendor,
}