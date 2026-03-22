import { HttpError } from "@snappin/lib/http-error";
import { GetUserEmailAddressProps, GetUserEmailAddressResponse } from "../../appRegistry.interface";
import { xero } from "../xero.client";
import { StatusCodes } from "http-status-codes";

export async function getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse> {
    await xero.initialize();
    xero.setTokenSet({ access_token: accessToken });

    const response = await xero.accountingApi.getUsers(
        (await xero.updateTenants())[0]?.tenantId
    );

    const user = response.body?.users?.[0];

    if (!user?.emailAddress) {
        throw new HttpError({
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Unable to retrieve Xero account email",
        });
    }

    return { emailAddress: user.emailAddress };
}