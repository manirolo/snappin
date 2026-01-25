import { Integration } from "./model/integration.model";
import { Invoice } from "./model/invoice.model";
import { OAuthSession, OAuthSessionResource } from "./model/oauthSession.model";

export const db = {
    oauthSession: OAuthSession<OAuthSessionResource>,
    integration: Integration,
    invoice: Invoice
}