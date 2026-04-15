import { NextRequest, NextResponse } from "next/server";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { mailReceived } from "@snappin/features/accounts/trigger/mail/mail.received.task";
import {
    AnyEmailProvider,
    resolveProvider,
} from "@snappin/apps/lib/resolveProvider";
import { appMetadata } from "@snappin/apps/app.metadata";
import { MailNotificationSchema } from "@snappin/features/accounts/trigger/mail/mail.received.schema";

export async function POST(request: NextRequest) {
    try {
        const appSlug = request.nextUrl.searchParams.get("appSlug") as
            | AppSlug
            | null;
        const validationToken =
            request.nextUrl.searchParams.get("validationToken");

        if (validationToken) {
            return new NextResponse(validationToken, {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        if (!appSlug) {
            return NextResponse.json({ ok: false }, { status: 400 });
        }

        const payload = await request.json();
        const appCategory = appMetadata[appSlug].category;

        const app = resolveProvider(appCategory, appSlug) as AnyEmailProvider;
        const events = await app.normalizeNotification({ body: payload });

        if (!events.length) {
            console.info(`${appSlug} ping received`);
            return NextResponse.json({ ok: true });
        }

        for (const event of events) {
            await mailReceived.trigger(event as unknown as MailNotificationSchema);
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Mail webhook error:", err);
        return NextResponse.json({ ok: true });
    }
}