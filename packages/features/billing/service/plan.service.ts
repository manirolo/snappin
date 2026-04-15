import { planRepository } from "../repository/plan.repository";

class PlanService {

    protected readonly _planRepo = planRepository

    async getFreeProduct(){
        return await this._planRepo.getFreeProduct()
    }

}

export const planService = new PlanService()