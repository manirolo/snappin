import { clerk } from "@snappin/features/trpc/config/clerk";
import { UserResource } from "@snappin/shared/user/user.schema";
import { userRepository } from "../repository/user.repository";

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