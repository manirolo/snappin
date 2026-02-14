import { schemaTask } from "@trigger.dev/sdk"
import { ZRetroScan } from "./retroScan.schema"

export const retroScan = schemaTask({
    id: "retro-scan",
    machine: "medium-1x",
    schema: ZRetroScan,
    run: async (payload) => {
        const { connectDB } = await import("@snappin/db/connect");
        const { EmailAppsStore } = await import("@snappin/apps/appRegistry")
        const { db } = await import("@snappin/db/index");

        connectDB();

        
    }
})