import { PLAN_SLUG_ORDER, PlanInterval, PlanResource } from "@snappin/shared/billing/plan.schema"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"

connectDB()

export class PlanRepository {

    async create(data: PlanResource) {
        return await db.plan.create(data)
    }

    async update(lsProductId: number, data: Partial<PlanResource>) {
        return await db.plan.findOneAndUpdate({ lsProductId }, data, { returnDocument: "after" })
    }

    async getFreeProduct(){
        return await db.plan.findOne({ slug: PLAN_SLUG_ORDER[0], interval: PlanInterval.MONTHLY }).lean()
    }

    async get(lsProductId: number) {
        return await db.plan.findOne({ lsProductId })
    }

    async getPlanBySlug(){
        
    }

    async delete(lsProductId: number) {
        await db.plan.findOneAndDelete({ lsProductId })
    }
}

export const planRepository = new PlanRepository()