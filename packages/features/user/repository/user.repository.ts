import { UserResource } from "@snappin/shared/user/user.schema"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"

connectDB()

export class UserRepository {

    async create(data: UserResource) {
        await db.user.create(data)
    }

    async update(clerkUserId: string, data: Partial<UserResource>) {
        await db.user.findOneAndUpdate({ clerkUserId }, data, { new: true })
    }

    async get(clerkUserId: string) {
        return await db.user.findOne({ clerkUserId })
    }

    async updateRaw(clerkUserId: string, update: Record<string, unknown>) {
        return await db.user.findOneAndUpdate(
            { clerkUserId },
            { $set: update },
            { new: true }
        )
    }

    async delete(clerkUserId: string) {
        await db.user.findOneAndDelete({ clerkUserId })
    }
}

export const userRepository = new UserRepository()