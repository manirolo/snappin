import { GoogleDriveAppServices } from "../googleDrive.app"
import { SnappinError } from "@snappin/lib/error/snappin.error"
import { ResolveIntegrationIdentity } from "../../appRegistry.interface"

export async function resolveIdentity({ code, codeVerifier }: ResolveIntegrationIdentity) {
    if (!code || !codeVerifier) {
        throw new SnappinError(
            "We received partial or no integration data from Google Drive",
            "invalid_integration_request"
        )
    }

    const { accessToken, refreshToken, accessTokenExpiresAt } =
        await GoogleDriveAppServices.exchangeCodeForTokens({ code, codeVerifier })

    const { emailAddress } = await GoogleDriveAppServices.getUserEmailAddress({ accessToken })

    return { accessToken, refreshToken, accessTokenExpiresAt, identifierEmail: emailAddress }
}