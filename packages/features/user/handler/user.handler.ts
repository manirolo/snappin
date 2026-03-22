import { GenericWebhookEvent } from "../../webhook/types";
import { UserJSON } from "@clerk/backend";
import { userService } from "../service/user.service";
import { UserResource } from "@snappin/shared/user/user.schema";

export class UserHandler {
    protected _userService = userService;

    /**
     * Create user
     * @param event 
     */
    async create(event: GenericWebhookEvent): Promise<void> {
        // Extract user from event
        const user = event.payload as UserJSON;
        // Create user payload
        const payload: UserResource = {
            clerkUserId: user.id,
            email: user.email_addresses[0]?.email_address ?? "",
            firstName: user.first_name ?? undefined,
            lastName: user.last_name ?? undefined,
            profileUrl: user.image_url ?? null,
            fullName: user.first_name + " " + user.last_name,
        }
        // Create user
        await this._userService.createUser(payload)
    }
}