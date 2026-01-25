import { AppSlug } from "@snappin/shared/apps/app.enum"

type EnqueueMailSync = {
    emailAddress: string,
    historyId: number,
    appSlug: AppSlug
}

export const enqueueMailSync = async (payload: EnqueueMailSync) => {
    const { processNewMails } = await import("./lib/tasker/trigger/newMails/process");
    await processNewMails.trigger(payload, { idempotencyKey: `${payload.appSlug}:${payload.emailAddress}:${payload.historyId}` });
    return
}