import { HttpError } from "@snappin/lib/http-error";
import { GetUserEmailAddressProps, GetUserEmailAddressResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";
import { StatusCodes } from "http-status-codes"

export async function getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse> {
    const gmail = getGmailClient(accessToken)

    const profile = await gmail.users.getProfile({ userId: "me" })

    if (!profile.data.emailAddress) {
        throw new HttpError({
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Unable to retrieve Google account email",
        })
    }
    
    const identifierEmail = profile.data.emailAddress

    return { emailAddress: identifierEmail }
}