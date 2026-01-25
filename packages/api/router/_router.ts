import { createTRPCRouter } from "../_trpc";
import { integrationRouter } from "./integration/_router";

export const router = createTRPCRouter({
    integration: integrationRouter,
})