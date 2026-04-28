import { GenericWebhookEvent } from "../../webhook/types";
import { UserJSON } from "@clerk/backend";
import { userService } from "../service/user.service";
import { UserResource } from "@snappin/shared/user/user.schema";
// import { planService } from "@snappin/features/billing/service/plan.service";
// import { polar } from "@snappin/features/trpc/config/polar";

export class UserHandler {
    protected _userService = userService;

    /**
     * Create user
     * @param event 
     */
    async create(event: GenericWebhookEvent): Promise<void> {
        // Extract user from event
        const user = event.payload as UserJSON;

        // const freeProduct = await planService.getFreeProduct()
        // let billingCustomerId = null
        // if (freeProduct?.polarProductId) {
        //     const customer = await polar.customers.create({
        //         externalId: user.id,
        //         email: user.email_addresses[0]?.email_address ?? "",
        //         name: user.first_name + " " + user.last_name,
        //     })

        //     billingCustomerId = customer.id

        //     await polar.subscriptions.create({
        //         productId: freeProduct.polarProductId,
        //         externalCustomerId: user.id,
        //     })
        // }

        // Create user payload
        const payload: UserResource = {
            clerkUserId: user.id,
            email: user.email_addresses[0]?.email_address ?? "",
            firstName: user.first_name ?? undefined,
            lastName: user.last_name ?? undefined,
            profileUrl: user.image_url ?? null,
            fullName: user.first_name + " " + user.last_name,
            // billingAccount: {
            //     customerId: billingCustomerId
            // }
        }
        // Create user
        await this._userService.createUser(payload)
    }
}