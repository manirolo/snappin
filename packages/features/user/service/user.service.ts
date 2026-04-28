import { clerk } from "@snappin/features/trpc/config/clerk";
import { UserResource } from "@snappin/shared/user/user.schema";
import { userRepository } from "../repository/user.repository";
import { resend } from "../../config/resend";
import { IS_PRODUCTION } from "@snappin/env";

export class UserService {
    protected readonly _userRepo = userRepository

    async createUser(data: UserResource) {
        if (!data.clerkUserId) return

        console.log("Received user create request")

        try {
            // validate user exist in clerk 
            const clerkUser = await clerk.users.getUser(data.clerkUserId);
            if (!clerkUser) throw new Error("User does not exist in clerk records");

            // Check if user already exists
            const existingUser = await this._userRepo.get(data.clerkUserId);
            if (existingUser) throw new Error("User already exist")


            if (data.email && data.firstName && data.lastName && IS_PRODUCTION) {
                const resendAudience = "712194f6-db61-4691-8c32-905493573cdb"
                const { error: createError } = await resend.contacts.create({
                    audienceId: resendAudience,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    unsubscribed: false,
                });

                if (createError) {
                    console.error("Error creating contact:", createError);
                }

                const { error: sendError } = await resend.emails.send({
                    to: data.email,
                    template: {
                        id: "welcome-email",
                        variables: {}
                    }
                })

                if (sendError) {
                    console.error("Error sending welcome email:", sendError);
                }
            }


            // create user
            await this._userRepo.create(data)

            console.log("Completed user create request")
        } catch (err) {
            console.error("createUser failed:", err)  // ← this will show you the real error
            throw err
        }
    }
}

export const userService = new UserService()