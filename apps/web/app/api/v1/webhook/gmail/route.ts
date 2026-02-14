import { logger } from "@snappin/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { mailReceived } from "@snappin/features/inbox/trigger/mail/mail.received"
import { AppSlug } from "@snappin/shared/apps/app.enum";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const payload = JSON.parse(rawBody);

    // Handle Google test ping / empty message
    if (!payload?.message?.data) {
      return NextResponse.json({ ok: true });
    }

    // Decode base64 safely
    const decoded = Buffer.from(payload.message.data, "base64").toString("utf-8");

    const data = JSON.parse(decoded);

    mailReceived.trigger({ emailAddress: data.emailAddress, historyId: data.historyId, appSlug: AppSlug.GMAIL })

    return NextResponse.json({ ok: true });

  } catch (err) {

    logger.error("Gmail webhook error:", err);

    // CRITICAL: always return 200 to stop retries
    return NextResponse.json({ ok: true }, { status: 502 });
  }
}
