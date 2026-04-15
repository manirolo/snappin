import { RevokeTokenProps } from "../../appRegistry.interface";
import { xero } from "../xero.client";

export async function revokeToken({ token, accessToken }: RevokeTokenProps) {
    try {
        await xero.initialize();
        xero.setTokenSet({
            access_token: accessToken ?? undefined,
            refresh_token: token,
        });

        const tenants = await xero.updateTenants();

        if (tenants?.[0]?.id) {
            await xero.disconnect(tenants[0].id);
        }

    } catch {
        // Disconnect best-effort — don't block revocation if it fails
    } finally {
        // Always revoke the token regardless of disconnect outcome
        await xero.revokeToken();
    }
}