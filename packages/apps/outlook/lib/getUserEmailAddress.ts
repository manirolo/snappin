import { HttpError } from "@snappin/lib/http-error";
import { GetUserEmailAddressProps, GetUserEmailAddressResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { StatusCodes } from "http-status-codes"

export async function getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse> {
    const client = getOutlookClient(accessToken);

    const profile = await client.api("/me")
        .select("mail,userPrincipalName,otherMails").get();

    const identifierEmail =
        profile.mail || profile.otherMails?.[0] || profile.userPrincipalName;

    if (!identifierEmail) {
        throw new HttpError({
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Unable to retrieve Microsoft account email",
        });
    }

    return { emailAddress: identifierEmail };
}