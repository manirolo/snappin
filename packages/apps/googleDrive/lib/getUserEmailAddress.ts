import { HttpError } from "@snappin/lib/http-error";
import { GetUserEmailAddressProps, GetUserEmailAddressResponse } from "../../appRegistry.interface";
import { getGoogleDriveClient } from "../googleDrive.client";
import { StatusCodes } from "http-status-codes"

export async function getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse> {
    const googleDrive = getGoogleDriveClient(accessToken)

    const about = await googleDrive.about.get({ fields: "user(emailAddress)" })

    if (!about.data.user?.emailAddress) {
        throw new HttpError({
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Unable to retrieve Google account email",
        })
    }

    return { emailAddress: about.data.user.emailAddress }
}