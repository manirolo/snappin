import { RevokeTokenProps } from "../../appRegistry.interface"
import { outlookConfig } from "../outlook.config";

export async function revokeToken({ token }: RevokeTokenProps) {
    const params = new URLSearchParams();

    params.append("client_id", outlookConfig.clientId);
    params.append("client_secret", outlookConfig.clientSecret);
    params.append("token", token);
    params.append("token_type_hint", "refresh_token");

    const res = await fetch(
        `https://login.microsoftonline.com/common/oauth2/v2.0/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to revoke Microsoft token");
    }
}