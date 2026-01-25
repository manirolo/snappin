import { GmailOAuthProvider } from "./provider.interface";
import { GoogleOAuthProvider } from "./google.provider";
import { AppSlug } from "@snappin/shared/apps/app.enum";

export const OAuthProviders: Record<AppSlug, GmailOAuthProvider> = {
    [AppSlug.GMAIL]: GoogleOAuthProvider
}