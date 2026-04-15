import { SubscriptionResource } from "@snappin/shared/billing/subscription.schema"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"

connectDB()

export class SubscriptionRepository {

    async create(data: SubscriptionResource) {
        await db.subscription.create(data)
    }

    async update(subscriptionId: number, data: Partial<SubscriptionResource>) {
        return await db.subscription.findOneAndUpdate({ subscriptionId }, data, { returnDocument: "after" })
    }

    async get(subscriptionId: number) {
        return await db.subscription.findOne({ subscriptionId })
    }

    async findOne(query: Partial<SubscriptionResource>) {
        return await db.subscription.findOne(query)
    }

    async delete(subscriptionId: number) {
        await db.subscription.findOneAndDelete({ subscriptionId })
    }
}

export const subscriptionRepository = new SubscriptionRepository()